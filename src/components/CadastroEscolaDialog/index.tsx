import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space, notification } from "antd";
import { fetchEtapasDeEnsino, fetchMunicipio, fetchUnidadeFederativa, sendCadastroEscolas } from "../../service/escolaApi";
import { SolicitacoesData } from "../../models/solicitacoes";
import { fetchCEP } from "../../service/apiUtils";
import { FilterOptions } from "../../pages/gerencia/GerenciarUsuario";
import "./styles.css";

interface CadastroEscolaDialogProps {
  dadosSoliciatacao: SolicitacoesData;
  closeDialog: (edicao: boolean) => void;
}

export function CadastroEscolaDialog({ closeDialog, dadosSoliciatacao }: CadastroEscolaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [listaMunicipios, setListaMunicipios] = useState<FilterOptions[]>([]);
  const [listaUfs, setListaUfs] = useState<FilterOptions[]>([]);
  const [OpcoesEtapasDeEnsino, setOpcoesEtapasDeEnsino] = useState<{ value: number; label: string }[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [uf, setUF] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [form] = Form.useForm();
  const [erroCEP, setErroCEP] = useState(false);
  const [cepEnviado, setCepEnviado] = useState('0');
  const [qtdAlunos, setQtdAlunos] = useState(1);

  const regrasPreenchimento = [
    {
      required: true,
      message: "Este campo de ${label} deve ser preenchido!",
    },
  ];

  const regrasLatLong = [
    {
      required: false,
      pattern: /^-?([1-8]?\d|90)(.\d{1,8})?$/,
      message: "Insira um número entre -90 e +90 com até 8 casas decimais, utilizando ponto",
    },
  ];

  const regrasQtdAlunosDocentes = [
    {
      required: true,
      pattern: /^[1-9]\d*$/,
      message: "Preencha com apenas números",
    },
  ];

  const parseCoordenadas = (value: string, name: string) => {
    const parts = value.split(',').map(part => part.trim());
    if (parts.length === 2) {
      const latitude = parseFloat(parts[0]);
      const longitude = parseFloat(parts[1]);

      form.setFieldsValue({
        latitude: latitude.toFixed(8),
        longitude: longitude.toFixed(8)
      });
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedData = event.clipboardData.getData('text');
    const fieldName = event.currentTarget.name;

    parseCoordenadas(pastedData, fieldName);
  };



  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    parseCoordenadas(value, name);
  };

  const consultaCEP = async (cep: string) => {
    try {
      if (cep.length === 8) {
        const res = await fetchCEP(cep);
        if (res.erro) {
          setErroCEP(false);
          form.setFields([
            {
              name: "cep",
              errors: ["CEP não encontrado"],
            },
          ]);
          setCepEnviado("0");
        } else {
          setErroCEP(true);
          form.setFieldsValue({
            endereco: res.logradouro,
            municipio: res.localidade,
            uf: res.uf,
          });
          setMunicipio(res.ibge);
          setUF(`${procuraIdUf(res.uf)}`);
          setCepEnviado(cep);
        }
      } else {
        setErroCEP(false);
      }
    } catch (error) { }
  };

  const consultaEtapasDeEnsino = async () => {
    try {
      const resposta = await fetchEtapasDeEnsino();
      const etapas = resposta.map((e) => ({ label: e.descricao, value: e.id }));
      setOpcoesEtapasDeEnsino(etapas);
    } catch (error) { }
  };

  const limpaMunicipio = () => {
    form.setFieldValue("municipio", undefined);
  };


  async function fetchUf(): Promise<void> {
    const listaUfs = await fetchUnidadeFederativa();
    const novaUf = listaUfs.map((u) => ({ id: '' + u.id, rotulo: u.sigla }));
    setListaUfs(novaUf);
  }

  async function fetchMunicipios(): Promise<void> {
    const listaMunicipios = await fetchMunicipio(Number(uf));
    const novoMunicipio = listaMunicipios.map((u) => ({ id: '' + u.id, rotulo: u.nome }));
    setListaMunicipios(novoMunicipio);
  }

  function procuraIdUf(rotulo: string) {
    console.log('uf: ', rotulo);
    return listaUfs.find((uf) => uf.rotulo === '' + rotulo)?.id;
  }

  const sendCadastro = async (values: any) => {

    if (!values.latitude) {
      values.latitude = "0";
    }

    if (!values.longitude) {
      values.longitude = "0";
    }

    const registroEscola = {
      NomeEscola: values.nome,
      IdRede: values.rede,
      CodigoEscola: values.codigo,
      IdUf: Number(uf),
      Cep: cepEnviado,
      Telefone: values.telefone,
      IdEtapasDeEnsino: values.ciclos,
      IdPorte: values.porte,
      Endereco: values.endereco,
      IdMunicipio: Number(municipio),
      IdLocalizacao: values.localizacao,
      Longitude: values.longitude,
      Latitude: values.latitude,
      NumeroTotalDeAlunos: qtdAlunos,
      NumeroTotalDeDocentes: values.numeroDocentes,
    };

    try {
      console.log(registroEscola);
      await sendCadastroEscolas(registroEscola);
      notification.success({ message: "Cadastro feito!" });
      closeDialog(true);
    } catch (error) {
      notificationApi.error({ message: "Erro ao fazer o cadastro" });
    }
  };

  useEffect(() => {
    fetchUf();
    form.setFieldValue("nome", dadosSoliciatacao?.nome.toUpperCase());
    form.setFieldValue("uf", dadosSoliciatacao?.uf);
    form.setFieldValue("municipio", dadosSoliciatacao?.municipio.nome);
    form.setFieldValue("numeroAlunos", dadosSoliciatacao?.quantidadeAlunos);
    form.setFieldValue("codigo", dadosSoliciatacao?.codigoEscola);

    setQtdAlunos(Number(dadosSoliciatacao?.quantidadeAlunos))
  }, [])


  useEffect(() => {
    fetchMunicipios();
  }, [uf]);

  return (
    <div
      className="overlay "
      data-testid="overlay"
      onMouseUp={() => { }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeDialog(true);
        }
      }}
      onKeyDown={() => { }}
    >
      <div className="custom-modal overflow-auto">
        {contextHolder}
        <div>
          <h2>Cadastrar Escola</h2>
          <Form
            form={form}
            onFinish={sendCadastro}
            name="Cadastro Escola"
            layout="vertical"
            autoComplete="off"
            preserve
          >
            <div className="row p-4">
              <div className="col-4">
                <Form.Item
                  name="nome"
                  label="Nome da Escola"
                  className="col-x1-5"
                  rules={regrasPreenchimento}
                >
                  <Input
                    className="custom-input"
                    type="text"
                    value={"dadosSoliciatacao?.nomeSolicitante"}
                  />
                </Form.Item>

                <Form.Item
                  name="rede"
                  label="Rede"
                  className="col-x1-5"
                  rules={regrasPreenchimento}
                >
                  <Select
                    data-testid={"selectRede"}
                  >
                    <Select value={1}>Municipal</Select>
                    <Select value={2}>Estadual</Select>
                    <Select value={3}>Privada</Select>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="codigo"
                  label="Codigo da Escola"
                  className="col-x1-5"
                  rules={[
                    {
                      required: true,
                      pattern: /^\d{8}$/,
                      message: "O código da escola deve conter 8 digitos",
                    },
                  ]}
                >
                  <Input className="custom-input" />
                </Form.Item>

                <Form.Item
                  name="cep"
                  label="CEP"
                  className="col-x1-5"
                  rules={[
                    {
                      required: true,
                      pattern: /^\d{8}$/,
                      message: "CEP inválido",
                    },
                  ]}
                >
                  <Input
                    className="custom-input"
                    onChange={(event) => {
                      consultaCEP(event.target.value);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="uf"
                  className="col-x1-5"
                  rules={regrasPreenchimento}
                  label="UF"
                >
                  <Select
                    data-testid={"selectUf"}
                    onChange={limpaMunicipio}
                    disabled={erroCEP}
                    notFoundContent={<p>Carregando...</p>}
                    placement="bottomRight"
                    optionLabelProp="label"
                  >
                    {listaUfs?.map((u) => (
                      <Select key={u.id} value={u.rotulo} >
                        <button
                          onClick={() => {
                            setUF(u.id);
                          }}
                          className="option-municipio"
                        >
                          {u.rotulo}
                        </button>
                      </Select>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="telefone"
                  label="Telefone"
                  className="col-x1-5"
                  rules={[
                    {
                      required: true,
                      pattern: /^\d{10,11}$/,
                      message: "O número de telefone deve conte 9 ou 8 digitos com DDD",
                    },
                  ]}>
                  <Input className="custom-input" />
                </Form.Item>

                <Form.Item
                  name="ciclos"
                  label="Etapas de Ensino"
                  rules={regrasPreenchimento}
                  className="col-x1-5"

                >
                  <Select
                    data-testid={"selectEtapasEnsino"}
                    mode="multiple"
                    onClick={consultaEtapasDeEnsino}
                    options={OpcoesEtapasDeEnsino}
                    onMouseDown={consultaEtapasDeEnsino}
                    notFoundContent={<p>Carregando...</p>}
                    placement="bottomRight"
                    optionLabelProp="label"
                    showSearch={false}
                  >
                    {OpcoesEtapasDeEnsino?.map((u) => (
                      <Select key={u.label} value={u.value} >
                        {u.value}
                      </Select>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="porte"
                  label="Porte"
                  rules={regrasPreenchimento}
                  className="col-x1-5"
                >
                  <Select
                    data-testid={"selectPorte"}
                  >
                    <Select value={1}>Até 50 matrículas de escolarização</Select>
                    <Select value={2}>
                      Entre 51 e 200 matrículas de escolarização
                    </Select>
                    <Select value={3}>
                      Entre 201 e 501 matrículas de escolarização
                    </Select>
                    <Select value={4}>
                      Entre 501 e 1000 matrículas de escolarização
                    </Select>
                    <Select value={5}>
                      Mais de 1000 matrículas de escolarização
                    </Select>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="endereco"
                  label="Endereço"
                  className="col-x1-5"
                  rules={regrasPreenchimento}
                >
                  <Input className="custom-input" />
                </Form.Item>

                <Form.Item
                  name="municipio"
                  label="Município"
                  className="col-x1-5"
                  rules={regrasPreenchimento}
                >
                  <Select

                    data-testid={"selectMunicipio"}
                    disabled={erroCEP}
                    notFoundContent={<p>Carregando...</p>}
                    placement="bottomRight"
                    optionLabelProp="label"
                  >
                    {listaMunicipios?.map((u) => (
                      <Select key={u.id} value={u.rotulo} >
                        <button
                          onClick={() => {
                            setMunicipio(u.id);
                          }}
                          className="option-municipio"
                        >
                          {u.rotulo}
                        </button>
                        {u.rotulo}
                      </Select>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="localizacao"
                  label="Localização"
                  className="col-x1-5"
                  rules={regrasPreenchimento}>
                  <Select
                    data-testid={"select-etapas-cadastro"}>
                    <Select value={1}>Rural</Select>
                    <Select value={2}>Urbana</Select>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="latitude"
                  label="Latitude"
                  className="col-x1-5"
                  rules={regrasLatLong}>
                  <Input
                    className="custom-input"
                    onPaste={handlePaste}
                  />
                </Form.Item>

                <Form.Item
                  name="longitude"
                  label="Longitude"
                  className="col-x1-5"
                  rules={regrasLatLong}
                >
                  <Input
                    onPaste={handlePaste}
                    className="custom-input"
                  />
                </Form.Item>

                <Form.Item
                  name="numeroAlunos"
                  label="Número Total de Alunos"
                  className="col-x1-5"
                  rules={regrasQtdAlunosDocentes}
                >
                  <Input
                    className="custom-input"
                    onChange={e => setQtdAlunos(form.getFieldValue("numeroAlunos"))}
                  />
                </Form.Item>

                <Form.Item
                  name="numeroDocentes"
                  label="Número Total de Docentes"
                  className="col-x1-5"
                  rules={regrasQtdAlunosDocentes}
                >
                  <Input className="custom-input" />
                </Form.Item>
              </div>
            </div>
            <div className="row justify-content-between">
              <Button
                data-testid="botaoCancelar"
                className="custom-button"
                type="primary"
                size="large"
                shape="round"
                onClick={() => closeDialog(true)}
              >
                Cancelar
              </Button>

              <Button
                className="custom-button "
                type="primary"
                size="large"
                htmlType="submit"
                shape="round"
              >
                Cadastrar
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
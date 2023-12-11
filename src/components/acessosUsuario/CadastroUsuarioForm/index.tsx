import { Form, Input, Radio, Select, Space, notification } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  sendCadastroUsuarioDnit,
  sendCadastroUsuarioTerceiro,
} from "../../../service/usuarioApi";
import {
  fetchMunicipio,
  fetchUnidadeFederativa,
} from "../../../service/escolaApi";
import "../../../styles/form.css";
import { ButtonComponent } from "../../Button";
import { ExcessoesApi } from "../../../service/excessoes";
import { fetchListaEmpresas } from "../../../service/empresaApi";
import { Autocomplete, TextField } from "@mui/material";
import { EmpresaModel } from "../../../models/empresa";
import { CadastroUsuarioTerceiroData } from "../../../models/service";

const { Option } = Select;

interface SelectProps {
  value: number;
  label: string;
}

const CadastroUsuarioForm: React.FC = () => {
  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification();
  const regras = [
    {
      required: true,
      message: "Por favor, preencha o campo ${name}!",
    },
  ];

  const [ufVisiveis, setufVisiveis] = useState(false);
  const [empresasVisiveis, setEmpresasVisiveis] = useState(false);
  const [uf, setUf] = useState<SelectProps[]>();
  const [ufSelected, setUfSelected] = useState<number>();
  const [municipios, setMunicipios] = useState<SelectProps[]>();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string | null>(
    null
  );

  let empresas = useRef<EmpresaModel[]>([]);

  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      if (empresasVisiveis) {
        var empresaSelected = empresas.current.find(
          (element) => element.razaoSocial === empresaSelecionada
        );
        const cadastroUsuarioTerceiro: CadastroUsuarioTerceiroData = {
          email: values.email,
          senha: values.senha,
          nome: values.nome,
          ufLotacao: values.uf,
          municipioId: values.municipio,
          cnpj: empresaSelected?.cnpj ?? "",
        };

        await sendCadastroUsuarioTerceiro(cadastroUsuarioTerceiro);
      } else {
        const cadastroUsuarioData = {
          email: values.email,
          senha: values.senha,
          nome: values.nome,
          ufLotacao: values.uf,
          municipioId: values.municipio,
        };
        await sendCadastroUsuarioDnit(cadastroUsuarioData);
      }
      notification.success({ message: "Cadastro feito!" });
      navigate("/login");
    } catch (error) {
      if (error instanceof ExcessoesApi) {
        api.error({ message: error.message });
      } else api.error({ message: "Erro interno" });
    }
  };

  async function fetchUf(): Promise<void> {
    const uf = await fetchUnidadeFederativa();
    const novaUf = uf.map((u) => ({ value: u.id, label: u.nome }));
    setUf(novaUf);
  }

  async function getMunicipios(): Promise<void> {
    const municipios = await fetchMunicipio(ufSelected!);
    const municipiosList = municipios.map((element) => ({
      value: element.id,
      label: element.nome,
    }));
    setMunicipios(municipiosList);
  }

  const handleCustomSubmit = () => {
    form.submit();
  };

  useEffect(() => {
    async function fetchData() {
      empresas.current = await fetchListaEmpresas();
    }
    fetchData();
  });

  return (
    <div className="formc">
      {contextHolder}
      <div>
        <h2>Cadastro</h2>
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          onFinish={(event) => {
            void onFinish(event);
          }}
          requiredMark="optional"
          className="form-email"
        >
          <Form.Item name="nome" label="Nome Completo" rules={regras}>
            <Input
              className="inputForm"
              prefix={<i className="fas fa-user"></i>}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail Institucional"
            rules={[
              {
                required: true,
                message: "Por favor, preencha o campo email!",
              },
              {
                type: "email",
                message: "O email não é válido",
              },
            ]}
          >
            <Input
              prefix={<i className="fas fa-envelope"></i>}
              className="inputForm"
            />
          </Form.Item>

          <Form.Item
            className="ext1 "
            name="uf"
            rules={regras}
            label="UF de Lotação"
          >
            <Select
              onClick={() => {
                void fetchUf();
              }}
              onMouseDown={() => {
                void fetchUf();
              }}
              notFoundContent={<p>Carregando...</p>}
              placement="topLeft"
              optionLabelProp="label"
              placeholder={<i className="fas fa-city" />}
              onSelect={(event) => setUfSelected(event)}
            >
              {uf?.map((u) => (
                <Option
                  data-testid={`option-${u.value}`}
                  key={u.value}
                  value={u.value}
                  label={
                    <>
                      <i className="fas fa-city" />
                      {u.label}
                    </>
                  }
                >
                  {u.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {ufSelected !== undefined && (
            <Form.Item
              className="ext1 "
              name="municipio"
              rules={regras}
              label="Município"
            >
              <Select
                onClick={() => {
                  void getMunicipios();
                }}
                onMouseDown={() => {
                  void getMunicipios();
                }}
                notFoundContent={<p>Carregando...</p>}
                placement="topLeft"
                optionLabelProp="label"
                placeholder={<i className="fas fa-city" />}
              >
                {municipios?.map((u) => (
                  <Option
                    data-testid={`option-municipio`}
                    key={u.value}
                    value={u.value}
                    label={
                      <>
                        <i className="fas fa-city" />
                        {u.label}
                      </>
                    }
                  >
                    {u.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="senha" label="Senha" rules={regras}>
            <Input.Password
              className="inputForm"
              prefix={<i className="fas fa-lock"></i>}
            />
          </Form.Item>

          <Form.Item
            name="confirmar senha"
            label="Confirmar Senha"
            rules={[
              { required: true, message: "Por favor, preencha o campo senha!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("senha") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("As senhas devem ser iguais")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              className="inputForm"
              prefix={<i className="fas fa-lock"></i>}
            />
          </Form.Item>

          <Form.Item className="item" name="tipo de usuário" rules={regras}>
            <Radio.Group className="radioButtons" name="tipo de usuário">
              <Radio
                value={"DNIT"}
                checked={ufVisiveis}
                onClick={() => {
                  setufVisiveis(true);
                  setEmpresasVisiveis(false);
                }}
              >
                <span className="radio1">Usuário DNIT</span>
              </Radio>
              <Radio
                value={"Terceirizada"}
                checked={empresasVisiveis}
                onClick={() => {
                  setEmpresasVisiveis(true);
                  setufVisiveis(false);
                }}
              >
                <span className="radio2">Empresa Executora</span>
              </Radio>
            </Radio.Group>
          </Form.Item>

          {empresasVisiveis && (
            <div>
              <Form.Item
                className="ext2"
                name="empresa"
                rules={regras}
                label="Empresa Executora"
              >
                <Autocomplete
                  disablePortal
                  id="combo-box"
                  data-testid="autocomplete"
                  options={empresas.current.map((e) => e.razaoSocial)}
                  value={empresaSelecionada}
                  onChange={(event, newValue) =>
                    setEmpresaSelecionada(newValue)
                  }
                  style={{ height: "50px" }}
                  className="inputForm"
                  renderInput={(params) => (
                    <TextField
                      data-testid="autocomplete-field"
                      {...params}
                      InputLabelProps={{ shrink: false }}
                    />
                  )}
                />
              </Form.Item>
            </div>
          )}

          <Form.Item>
            <Space>
              <ButtonComponent
                label="Cadastrar-se"
                buttonStyle="primary"
                padding="40px"
                onClick={handleCustomSubmit}
              />
            </Space>
          </Form.Item>

          <Link to="/login">Já possui cadastro? Faça o Login</Link>
        </Form>
      </div>
    </div>
  );
};

export default CadastroUsuarioForm;

import { Form, Input, Space, notification } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import LogoDNIT from "../../assets/logoDnitAzul.png";
import { AuthContext } from "../../provider/Autenticacao";
import fetchLogin from "../../service/login";
import "../../styles/form.css";
import ButtonComponent from "../Botao";

const LoginForm: React.FC = () => {

  const [form] = Form.useForm();
  const regras = [
    {
      required: true,
      message: "Por favor, preencha o campo ${name}!",
    },
  ];

  const { login, logout } = React.useContext(AuthContext);

  React.useEffect(() => {
    logout();
  }, []);

  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: any) => {
    const loginData = {
      email: values.email,
      senha: values.senha,
      nome: "",
      uf: 0,
    };

    try {
      await fetchLogin(loginData);
      notification.success({message: "Login realizado!"})
      login();
    } catch (error) {
      api.error({ message: `Erro ao fazer login` });
    }
  };

  return (
    <div className="form">
      {contextHolder}
      <img className="logoDnit" src={LogoDNIT} alt="Logo DNIT" />
      <div>
        <h2>Login</h2>
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
          <Form.Item name="email" label="E-mail" rules={regras}>
            <Input
              prefix={<i className="fas fa-envelope"></i>}
              className="inputForm"
            />
          </Form.Item>
          <Form.Item name="senha" label="Senha" rules={regras}>
            <Input.Password
              className="inputForm"
              prefix={<i className="fas fa-lock"></i>}
            />
          </Form.Item>
          <Link to="/esqueciSenha">Esqueceu a senha?</Link>
          <Form.Item>
            <Space>
              <ButtonComponent
                nome="Entrar"
                cor="#1351B4"
                cor_letra="#FFFFFF"
                cor_borda="#1351B4"
                largura="10em"
              />
            </Space>
          </Form.Item>
          <Link to="/cadastro">Não possui cadastro? Cadastrar-se</Link>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Modal, Card, Skeleton, Button, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import styles from "./page.module.css";

const { TextArea } = Input;
const { Option } = Select;

export default function Tarefas() {
  const [data, setData] = useState({
    tarefas: [],
    users: [],
    loading: true,
    current: 1,
    pageSize: 5,
  });

  const [modalInfo, setModalInfo] = useState({
    visible: false,
    tarefa: null,
    user: null,
    loading: false,
  });

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const [tarefasResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:4000/api/task"),
          axios.get("http://localhost:4000/api/users")
        ]);
        
        setData({ 
          tarefas: tarefasResponse.data, 
          users: usersResponse.data,
          loading: false, 
          current: 1, 
          pageSize: 5 
        });
      } catch {
        toast.error("Erro ao carregar tarefas");
        setData((d) => ({ ...d, loading: false }));
      }
    };

    fetchTarefas();
  }, []);

  const openModal = async (tarefa) => {
    const user = data.users.find(u => u.id === tarefa.user_id);
    setModalInfo({ visible: true, tarefa, user, loading: false });
  };

  const handleCreateTask = async (values) => {
    try {
      console.log("🚀 Enviando dados para criar tarefa:", values);
      
      const response = await axios.post("http://localhost:4000/api/task", values, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Tarefa criada com sucesso:", response.data);
      
      // Adicionar a nova tarefa à lista local
      setData(prevData => ({
        ...prevData,
        tarefas: [...prevData.tarefas, response.data]
      }));
      
      setCreateModalVisible(false);
      form.resetFields();
      toast.success("Tarefa criada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao criar tarefa:", error);
      console.error("❌ Resposta do servidor:", error.response?.data);
      console.error("❌ Status:", error.response?.status);
      
      if (error.response?.status === 400) {
        toast.error("Erro: Dados inválidos - " + (error.response?.data?.message || "Verifique os campos"));
      } else if (error.response?.status === 500) {
        toast.error("Erro interno do servidor");
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Erro: Não foi possível conectar com o backend");
      } else {
        toast.error("Erro ao criar tarefa: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const testCreateAPI = async () => {
    const testData = {
      title: "Teste de Conexão",
      description: "Esta é uma tarefa de teste para verificar a API",
      status: "Pendente",
      user_id: data.users.length > 0 ? data.users[0].id : 1
    };
    
    console.log("🧪 Testando API de criação com dados:", testData);
    
    try {
      const response = await axios.post("http://localhost:4000/api/tarefas", testData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Teste da API bem-sucedido:", response.data);
      toast.success("✅ API de criação está funcionando!");
      
      // Atualizar lista
      setData(prevData => ({
        ...prevData,
        tarefas: [...prevData.tarefas, response.data]
      }));
      
    } catch (error) {
      console.error("❌ Teste da API falhou:", error);
      console.error("❌ Resposta completa:", error.response);
      toast.error("❌ Falha no teste da API: " + (error.response?.data?.message || error.message));
    }
  };

  const paginatedTarefas = () => {
    const start = (data.current - 1) * data.pageSize;
    return data.tarefas.slice(start, start + data.pageSize);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Lista de Tarefas</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
          style={{ marginTop: '10px' }}
        >
          Adicionar Tarefa
        </Button>
      </div>

      <Pagination
        current={data.current}
        pageSize={data.pageSize}
        total={data.tarefas.length}
        onChange={(page, size) =>
          setData((d) => ({ ...d, current: page, pageSize: size }))
        }
        showSizeChanger
        pageSizeOptions={["5", "10", "50"]}
      />

      {data.loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Skeleton active />
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {paginatedTarefas().map((tarefa) => {
            const user = data.users.find(u => u.id === tarefa.user_id);
            return (
              <Card
                key={tarefa.id}
                className={styles.card}
                hoverable
                onClick={() => openModal(tarefa)}
                title={tarefa.title}
              >
                <p><strong>Status:</strong> {tarefa.status}</p>
                <p><strong>Descrição:</strong> {tarefa.description.substring(0, 80)}...</p>
                <p><strong>Responsável:</strong> {user?.name || 'Usuário não encontrado'}</p>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        title={`Tarefa: ${modalInfo.tarefa?.title}`}
        open={modalInfo.visible}
        onCancel={() =>
          setModalInfo({
            visible: false,
            tarefa: null,
            user: null,
            loading: false,
          })
        }
        onOk={() =>
          setModalInfo({
            visible: false,
            tarefa: null,
            user: null,
            loading: false,
          })
        }
        width={600}
      >
        {modalInfo.loading ? (
          <Skeleton active />
        ) : modalInfo.tarefa ? (
          <div>
            <p>
              <span style={{ fontWeight: "bold" }}>ID:</span>{" "}
              {modalInfo.tarefa.id}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Título:</span>{" "}
              {modalInfo.tarefa.title}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Descrição:</span>{" "}
              {modalInfo.tarefa.description}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Status:</span>{" "}
              {modalInfo.tarefa.status}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Responsável:</span>{" "}
              {modalInfo.user?.name || 'Usuário não encontrado'}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
              {modalInfo.user?.email || 'Email não encontrado'}
            </p>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Tarefa não encontrada.</p>
        )}
      </Modal>

      {/* Modal para criar nova tarefa */}
      <Modal
        title="Criar Nova Tarefa"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTask}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Por favor, insira o título!' }]}
          >
            <Input placeholder="Digite o título da tarefa" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: 'Por favor, insira a descrição!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Digite a descrição da tarefa" 
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Por favor, selecione o status!' }]}
          >
            <Select placeholder="Selecione o status">
              <Option value="Pendente">Pendente</Option>
              <Option value="Em andamento">Em andamento</Option>
              <Option value="Concluído">Concluído</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="user_id"
            label="Responsável"
            rules={[{ required: true, message: 'Por favor, selecione o responsável!' }]}
          >
            <Select placeholder="Selecione o responsável">
              {data.users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button 
              onClick={() => {
                setCreateModalVisible(false);
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Criar Tarefa
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <ToastContainer position="top-right" autoClose={4500} />
    </div>
  );
}
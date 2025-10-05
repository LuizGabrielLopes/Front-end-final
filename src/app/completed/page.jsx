"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Pagination, 
  Skeleton, 
  Button, 
  Modal, 
  Descriptions,
  Tag,
  Select,
  Space
} from "antd";
import { PlusOutlined, EyeOutlined, SortAscendingOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./completed.module.css";

export default function CompletedTasks() {
  const [data, setData] = useState({
    tarefas: [],
    users: [],
    loading: true,
    current: 1,
    pageSize: 5,
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortOrder, setSortOrder] = useState('priority'); // 'priority', 'status', 'title', 'date'
  const router = useRouter();

  useEffect(() => {
    fetchTarefas();
  }, []);

  const fetchTarefas = async () => {
    try {
      const [tarefasResponse, usersResponse] = await Promise.all([
        axios.get("http://localhost:4000/api/task"),
        axios.get("http://localhost:4000/api/users"),
      ]);

      // Filtrar apenas tarefas concluídas
      const tarefasConcluidas = tarefasResponse.data.filter(tarefa => tarefa.status === 'Concluído');

      setData({
        tarefas: tarefasConcluidas,
        users: usersResponse.data,
        loading: false,
        current: 1,
        pageSize: 5,
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados!");
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/task/${id}`);
      setData((prevData) => ({
        ...prevData,
        tarefas: prevData.tarefas.filter((tarefa) => tarefa.id !== id),
      }));
      toast.success("Tarefa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro ao excluir tarefa!");
    }
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const getResponsibleName = (userId) => {
    const user = data.users.find(user => user.id === userId);
    return user ? user.name : 'Usuário não encontrado';
  };

  const getPriorityOrder = (priority) => {
    switch (priority) {
      case 'Alta': return 1;
      case 'Média': return 2;
      case 'Baixa': return 3;
      default: return 4;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'red';
      case 'Média': return 'orange';
      case 'Baixa': return 'green';
      default: return 'default';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Alta': return '#dc2626';
      case 'Média': return '#d97706';
      case 'Baixa': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const sortTarefas = (tarefas, order) => {
    return [...tarefas].sort((a, b) => {
      switch (order) {
        case 'priority':
          return getPriorityOrder(a.priority || 'Baixa') - getPriorityOrder(b.priority || 'Baixa');
        case 'status':
          const statusOrder = { 'Pendente': 1, 'Em andamento': 2, 'Concluído': 3 };
          return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.id) - new Date(a.id); // Ordenar por ID (mais recente primeiro)
        default:
          return 0;
      }
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const paginatedTarefas = () => {
    const sortedTarefas = sortTarefas(data.tarefas, sortOrder);
    const start = (data.current - 1) * data.pageSize;
    return sortedTarefas.slice(start, start + data.pageSize);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pendente": return "red";
      case "Em andamento": return "orange";
      case "Concluído": return "green";
      default: return "default";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pendente": return "#dc2626";
      case "Em andamento": return "#d97706";
      case "Concluído": return "#16a34a";
      default: return "#6b7280";
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tarefas Concluídas</h1>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        gap: '20px'
      }}>
        <Space size="middle">
          <span style={{ fontSize: '16px', fontWeight: '600' }}>
            <SortAscendingOutlined style={{ marginRight: '8px' }} />
            Ordenar por:
          </span>
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            style={{ width: 200 }}
            options={[
              { value: 'priority', label: 'Prioridade' },
              { value: 'title', label: 'Título (A-Z)' }
            ]}
          />
        </Space>
        
        <Button 
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          style={{
            background: "linear-gradient(135deg, #6b7280, #9ca3af)",
            border: "none",
            borderRadius: "12px",
            height: "50px",
            fontSize: "16px",
            fontWeight: "600",
            color: "white"
          }}
        >
          Voltar
        </Button>
      </div>

      <div className={styles.cardsContainer}>
        {data.loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.card}>
              <Skeleton active />
            </div>
          ))
        ) : (
          paginatedTarefas().map((tarefa) => (
            <div 
              key={tarefa.id} 
              className={styles.card}
              onClick={() => openTaskDetails(tarefa)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <h3 className={styles.cardTitle}>{tarefa.title}</h3>
                <div className={styles.cardDescription}>
                  <p style={{ marginBottom: "8px" }}>
                    {tarefa.description.length > 100 
                      ? `${tarefa.description.substring(0, 100)}...` 
                      : tarefa.description
                    }
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: "500" }}>
                      Status: <span style={{ color: getStatusStyle(tarefa.status) }}>{tarefa.status}</span>
                    </span>
                    {tarefa.priority && (
                      <span style={{ fontWeight: "500" }}>
                        Prioridade: <span style={{ color: getPriorityStyle(tarefa.priority) }}>{tarefa.priority}</span>
                      </span>
                    )}
                  </div>
                  <p style={{ marginTop: "4px" }}>
                    Responsável: {getResponsibleName(tarefa.user_id)}
                  </p>
                </div>
              </div>
              
              <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                <Button 
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openTaskDetails(tarefa);
                  }}
                  style={{ color: "#1e40af", fontWeight: "500" }}
                >
                  Ver Detalhes
                </Button>
                <Button 
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(tarefa.id);
                  }}
                  style={{ fontWeight: "500" }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {data.tarefas.length > 0 && (
        <div className={styles.pagination}>
          <Pagination
            current={data.current}
            total={data.tarefas.length}
            pageSize={data.pageSize}
            onChange={(page, size) =>
              setData((d) => ({ ...d, current: page, pageSize: size }))
            }
            showSizeChanger
            pageSizeOptions={["5", "10", "15"]}
          />
        </div>
      )}

      {/* Modal de Detalhes da Tarefa */}
      <Modal
        title={
          <div style={{ fontSize: "1.4rem", fontWeight: "600", color: "#1e40af" }}>
            <EyeOutlined style={{ marginRight: "8px" }} />
            Detalhes da Tarefa
          </div>
        }
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Fechar
          </Button>
        ]}
        width={700}
        centered
      >
        {selectedTask && (
          <Descriptions 
            bordered 
            column={1}
            style={{ marginTop: "16px" }}
            labelStyle={{ 
              fontWeight: "600", 
              color: "#1e40af",
              backgroundColor: "rgba(219, 234, 254, 0.5)",
              width: "150px"
            }}
            contentStyle={{ 
              backgroundColor: "white",
              padding: "12px 16px"
            }}
          >
            <Descriptions.Item label="ID">
              #{selectedTask.id}
            </Descriptions.Item>
            
            <Descriptions.Item label="Título">
              <span style={{ fontSize: "16px", fontWeight: "500" }}>
                {selectedTask.title}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item label="Descrição">
              <div style={{ lineHeight: "1.6", fontSize: "15px" }}>
                {selectedTask.description}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="Status">
              <Tag 
                color={getStatusColor(selectedTask.status)}
                style={{ 
                  fontSize: "14px", 
                  padding: "4px 12px",
                  fontWeight: "500"
                }}
              >
                {selectedTask.status}
              </Tag>
            </Descriptions.Item>
            
            {selectedTask.priority && (
              <Descriptions.Item label="Prioridade">
                <Tag 
                  color={getPriorityColor(selectedTask.priority)}
                  style={{ 
                    fontSize: "14px", 
                    padding: "4px 12px",
                    fontWeight: "500"
                  }}
                >
                  {selectedTask.priority}
                </Tag>
              </Descriptions.Item>
            )}
            
            <Descriptions.Item label="Responsável">
              <div style={{ fontSize: "15px", fontWeight: "500" }}>
                {getResponsibleName(selectedTask.user_id)}
              </div>
            </Descriptions.Item>
            
          </Descriptions>
        )}
      </Modal>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
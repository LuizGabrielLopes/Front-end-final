"use client";

import { useEffect, useState, } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Pagination, 
  Skeleton, 
  Button, 
  Select,
  Space
} from "antd";
import { PlusOutlined, EyeOutlined, SortAscendingOutlined, CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./page.module.css";

export default function Home() {
  const [data, setData] = useState({
    tarefas: [],
    users: [],
    loading: true,
    current: 1,
    pageSize: 5,
  });
  
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

      setData({
        tarefas: tarefasResponse.data,
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
      <h1 className={styles.title}>Gerenciador de Tarefas</h1>
      
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
              { value: 'status', label: 'Status' },
              { value: 'title', label: 'Título (A-Z)' }
            ]}
          />
        </Space>
        
        <Space size="middle">
          <Button 
            type="default"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={() => router.push("/completed")}
            style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              border: "none",
              borderRadius: "12px",
              height: "50px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white"
            }}
          >
            Tarefas Concluídas
          </Button>
          
          <Button 
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => router.push("/create")}
            style={{
              background: "linear-gradient(135deg, #1e40af, #3b82f6)",
              border: "none",
              borderRadius: "12px",
              height: "50px",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            Nova Tarefa
          </Button>
          
          <Link href="/about" prefetch>
          <Button 
            type="default"
            size="large"
            icon={<InfoCircleOutlined />}
            onClick={() => router.push("/about")}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none",
              borderRadius: "12px",
              height: "50px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white"
            }}
          >
            Sobre
          </Button>
          </Link>
        </Space>
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
              onClick={() => router.push(`/task/${tarefa.id}`)}
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
                    router.push(`/task/${tarefa.id}`);
                  }}
                  style={{ color: "#1e40af", fontWeight: "500" }}
                >
                  Ver Detalhes
                </Button>
                <Button 
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/edit/${tarefa.id}`);
                  }}
                  style={{ color: "#1e40af", fontWeight: "500" }}
                >
                  Editar
                </Button>
                <Button 
                  type="link"
                  danger
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
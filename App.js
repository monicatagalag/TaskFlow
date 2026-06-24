import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { supabase } from './lib/supabase';
import TaskItem from './components/TaskItem';
import AddTaskModal from './components/AddTaskModal';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  async function loadTasks() {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) return console.log(error.message);
    setTasks(data);
  }

  async function handleSubmitTask(title) {
    const { error } = await supabase.from('tasks').insert([{ title, completed: false }]);
    if (error) {
      Toast.show({ type: 'error', text1: 'Could not add task', text2: error.message });
      return;
    }
    setModalVisible(false);
    loadTasks();
    Toast.show({ type: 'success', text1: 'Task added' });
  }

  async function toggleTask(item) {
    const { error } = await supabase.from('tasks').update({ completed: !item.completed }).eq('id', item.id);
    if (error) return console.log(error.message);
    loadTasks();
  }

  async function handleDeleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) {
    Toast.show({ type: 'error', text1: 'Could not delete task' });
    return;
  }
  loadTasks();
  Toast.show({ type: 'success', text1: 'Task deleted' });
}

  useEffect(() => { loadTasks(); }, []);

  return (
  <View style={styles.container}>
    <View style={headerStyles.header}>
      <Text style={headerStyles.title}>TaskFlow</Text>
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem item={item} onToggle={toggleTask} onDelete={handleDeleteTask} />
      )}
    />
    <AddTaskModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onSubmit={handleSubmitTask}
    />
    <Toast />
  </View>
);
}

const headerStyles = StyleSheet.create({
  header: { paddingTop: 50, paddingBottom: 16, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2A44' },
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  fab: { backgroundColor: '#2E5BBA', borderRadius: 8, padding: 8 },
});
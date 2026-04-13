import { View, Text, StyleSheet } from 'react-native';

export default function DrawerLayout() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the main app layout. Drawer goes here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0F1E',
  },
  text: {
    color: '#F0F4FF',
  },
});

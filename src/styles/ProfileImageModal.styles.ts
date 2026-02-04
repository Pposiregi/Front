import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'JUA',
    marginBottom: 16,
    color: '#333',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#4F46E5',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    padding: 10,
  },
  cancelText: {
    fontFamily: 'JUA',
    fontSize: 22,
    color: '#333',
  },
  saveBtn: {
    padding: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  saveText: {
    fontFamily: 'JUA',
    fontSize: 22,
    color: '#fff',
  },
});

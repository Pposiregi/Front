import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 22,
    color: '#111827',
  },
  headerTitle: {
    fontFamily: 'JUA',
    fontSize: 22,
    color: '#111827',
    paddingHorizontal: 8,
  },
  section: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  rowLabel: {
    fontFamily: 'GowunDodum',
    fontSize: 16,
    color: '#111827',
  },
  rowMuted: {
    color: '#9CA3AF',
  },
  arrow: {
    fontSize: 18,
    color: '#F59E0B',
  },
  actionArea: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
  },
  logoutText: {
    fontFamily: 'GowunDodum',
    fontSize: 15,
    color: '#111827',
  },
  withdrawButton: {
    backgroundColor: '#FEE2E2',
  },
  withdrawText: {
    fontFamily: 'GowunDodum',
    fontSize: 15,
    color: '#991B1B',
  },
  footerIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerIcon: {
    fontSize: 42,
    marginHorizontal: 12,
    color: '#D1D5DB',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontFamily: 'JUA',
    fontSize: 18,
    color: '#111827',
  },
  modalBody: {
    marginTop: 10,
    fontFamily: 'GowunDodum',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 10,
  },
  modalCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    fontFamily: 'GowunDodum',
    fontSize: 14,
    color: '#111827',
  },
  modalConfirm: {
    backgroundColor: '#F59E0B',
  },
  modalConfirmText: {
    fontFamily: 'GowunDodum',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default styles;

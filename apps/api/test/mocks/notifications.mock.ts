// Notifications Mock - Mock NotificationsService for testing
export const mockNotificationsService = {
  sendWhatsApp: jest.fn(),
  sendEmail: jest.fn(),
  sendSMS: jest.fn(),
  sendPaymentReminder: jest.fn(),
  sendLowStockAlert: jest.fn(),
};

export const mockWATIService = {
  sendMessage: jest.fn(),
  sendTemplateMessage: jest.fn(),
};

export const mockSendGridService = {
  send: jest.fn(),
  sendMultiple: jest.fn(),
};

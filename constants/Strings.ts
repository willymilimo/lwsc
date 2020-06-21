export default {
  // screens
  HomeScreen: "Home",
  BillsScreen: "Bills",
  AccountScreen: "Account",
  NotificationsScreen: "Notifications",
  LocatePayPointScreen: "Locate Pay Point",
  ManageAccountsScreen: "Manage Accounts",
  NotificationScreen: "Notification",
  PaymentMethodScreen: "Payment Options",
  MakePaymentScreen: "Make Payment",
  PaymentScreen: "Payment Screen",
  ServicesScreen: "Services",
  FeedbackScreen: "Feedback",
  WebviewScreen: "Debit/ATM Card",
  BowserForm: "Bowser Quotation",
  OpenAccountForm: "Open Account",
  MeterReadingScreen: "Meter Reading",
  PaymentHistoryScreen: "Payment History",
  ReportLeakageScreen: "Report Leakage",
  LodgeComplaintScreen: "Lodge Complaint",
  GeneralServiceForm: "Request Service",
  ReConnection: "Reconnection",
  ApplyForPaymentScheduleScreen: "Apply for Payment Schedule",
  ReadMeterScreen: "Read Meter",
  LwscStaffAuthScreen: "Login",

  /*************** Begin REDUCER TYPES *****************/
  WHITE_THEME: "WHITE_THEME",
  BLUE_THEME: "BLUE_THEME",

  // SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  /*************** Eend REDUCER TYPES *****************/

  /*************** Begin Stack & Tab Navigators *****************/
  HomeTabNavigator: "LWSC",
  /*************** End Stack & Tab Navigators *****************/

  /*************** Begin Storage Constants *****************/
  THEME_STORAGE: "THEME_STORAGE",
  NOTIFICATIONS_STORAGE: "NOTIFICATIONS_STORAGE",
  ACCOUNTS_STORAGE: "ACCOUNT_STORAGE",
  PAYPOINTS_STORAGE: "PAYPOINT_STORAGE",
  PAYMENT_HISTORY_STORAGE: "PAYMENT_HISTORY_STORAGE",
  USER_STORAGE: "USER_STORAGE",
  /*************** End Storage Constants *****************/

  // API
  REQUEST_OTP:
    "https://apps.LWSC.co.zm/LWSCRestApp/api/setpassword/login/msisdn", // 'http://10.3.104.229:5000/api/auth/request',
  VALIDATE_OTP:
    "https://apps.LWSC.co.zm/LWSCRestApp/api/getpassword/login/msisdn", //{msisdn}/pin/{pin}', // 'http://10.3.104.229:5000/api/auth/validate',

  // ASYNC Storage constants
  USER_TOKEN: "USER_TOKEN_CONSTANT",
  USER_OBJECT: "USER_OBJECT",
  FEEDBACK_OBJECT: "FEEDBACK_OBJECT",

  // API ACCESS
  API_USERNAME: "LWSCApp",
  API_PASSWORD: "rzHS8BS54UZ4mtelAppx44JAsAcrdx9q9",

  // VOUCHER CREDENTIALS
  VOUCHER_API_USERNAME: "",
  VOUCHER_API_PASSWORD: "",

  GOOGLE_MAP_API_KEY: "AIzaSyCz8BEsSB8Xs1e7B8pTizryIM8-wzNDEP0",

  // error message
  Exception:
    "We are very sorry. An internal error occurred. Please report this problem.",

  EMAIL: "customerservice@lwsc.com.zm",
  SMS: "3455",
  LEAKAGE_AIRTEL_LINE: "+260975618618",
  LEAKAGE_ZAMTEL_LINE: "+260950948028",
  CUSTOMER_SERVICE: ["+260211251571", "+260211250002"],
  WEBSITE: "http://www.lwsc.com.zm",
  CONTACT_US_PAGE: "http://www.lwsc.com.zm/?page_id=46",
  FACEBOOK: "lusakawater",
  MESSENGER: "http://m.me/lusakawater",

  INTERNET_FAILURE: {
    title: "INTERNET FAILURE",
    message:
      "Please check your internet connection. Turn on your mobile data or WIFI.",
  },

  ACCOUNT_NUMBER_NOT_FOUND: {
    title: "Account Not Found",
    message: "Please input a valid LWSC Number (starting with 260)",
  },

  INVALID_MSISDN_9: {
    title: "Invalid Number",
    message: "Please input a valid LWSC Number (e.g. 950000000 or 212910700)",
  },

  REPORT_PROBLEM: {
    title: "Report Problem",
    message: "An unexpected error happened. Please report this problem",
  },

  SELF_REPORTING_PROBLEM: {
    title: "Report Problem",
    message: "An unexpected error occurred. It will be reported.",
  },

  INVALID_OTP: {
    title: "Invalid One Time Password",
    message:
      "Please be sure to use the One Time Password sent by SMS to your phone",
  },

  FEEDBACK_SENT: {
    title: "Feedback Sent",
    message:
      "Thank you for your feedback. Your reference number is: ${0}. Please use it when following up on your query.",
  },

  COMING_SOON: {
    title: "Coming Soon",
    message: "Coming to LWSCConnect. Watch the space.",
  },

  CAMERA_PERMISSION: {
    title: "Camera Permission",
    message: "Sorry, we need camera permissions to make this work!",
  },

  CAMERA_ROLL_PERMISSION: {
    title: "Permission",
    message: "Sorry, we need camera roll permissions to make this work!",
  },

  LOCATION_PERMISSION: {
    title: "Location Permission",
    message:
      "Sorry, we need location permission to quickly address the address!",
  },
};

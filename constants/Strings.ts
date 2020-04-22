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
  PaymentScreen: "Make Payment",
  ServicesScreen: "Services",
  FeedbackScreen: "Feedback",

  WHITE_THEME: "WHITE_THEME",
  BLUE_THEME: "BLUE_THEME",

  // stacks
  HomeTabNavigator: "LWSC",
  //   ProfileStack: "ProfileStack",
  //   MoreStack: "MoreStack",
  //   PromotionsStack: "PromotionsStackNavigator",
  //   BalancesStack: "BalancesStackNavigator",
  //   AirtimeTopUpStack: "AirtimeTopUpStack",
  //   RegisterStack: "RegisterStack",
  //   ContactUsStack: "ContactUsStack",
  //   VisaStackNavigator: "VisaStackNavigator",
  //   MinutesAndDataStackNavigator: "MinutesAndDataStackNavigator",
  //   ValueAddedServicesStackNavigator: "ValueAddedServicesStackNavigator",
  //   BuyForOtherStack: "BuyForOtherStack",
  //   FeedbackHistoryStackNavigator: "FeedbackHistoryStackNavigator",

  // async storage
  THEME_STORAGE: "THEME_STORAGE",

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

  INVALID_MSISDN: {
    title: "Invalid LWSC Number",
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
};

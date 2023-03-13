import { toast } from 'react-toastify';

const announceTreatmentError = (error) => {
  const message = error.response.data;
  toast.warn(message.substring(0, message.indexOf('***') - 1));
};

export { announceTreatmentError };

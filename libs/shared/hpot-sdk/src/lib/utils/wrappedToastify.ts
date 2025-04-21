import { toast, ToastContent, ToastOptions } from 'react-toastify';
import { CustomToastifyContainer } from '../../components/CustomToastify/CustomToastifyContainer';
import { ToastifyIconTemplates } from '../../components/CustomToastify/IconTemplates';
import 'react-toastify/dist/ReactToastify.css';

export interface wrappedToastifyArgs {
  message: React.ReactNode;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  options?: ToastOptions;
}

export const WrappedToastify = {
  info: (args: wrappedToastifyArgs) => {
    console.log('info', args);
    return toast.info(
      CustomToastifyContainer({
        children: args.message,
        title: args.title,
        icon: args.icon ?? false,
      }),
      {
        autoClose: 5000,
        icon: false,
        ...args.options,
      }
    );
  },
  pending: (args: wrappedToastifyArgs) => {
    console.log('pending', args);
    return toast.info(
      CustomToastifyContainer({
        children: args.message,
        title: args.title ?? 'Pending',
        icon: args.icon ?? ToastifyIconTemplates.pendingRocket,
      }),
      {
        autoClose: 5000,
        icon: false,
        ...args.options,
      }
    );
  },
  success: (args: wrappedToastifyArgs) => {
    console.log('success', args);
    return toast.success(
      CustomToastifyContainer({
        children: args.message,
        title: args.title ?? 'Success',
        icon: args.icon ?? ToastifyIconTemplates.successRocket,
      }),
      {
        autoClose: 5000,
        icon: false,
        ...args.options,
      }
    );
  },
  error: (args: wrappedToastifyArgs) => {
    console.log('error', args);
    return toast.error(
      CustomToastifyContainer({
        children: args.message,
        title: args.title ?? 'Error',
        icon: args.icon ?? ToastifyIconTemplates.warning,
      }),
      {
        autoClose: 5000,
        icon: false,
        ...args.options,
      }
    );
  },
  warn: (args: wrappedToastifyArgs) => {
    return toast.warning(
      CustomToastifyContainer({
        children: args.message,
        title: args.title ?? 'Warning',
        icon: args.icon ?? ToastifyIconTemplates.warning,
      }),
      {
        autoClose: 5000,
        icon: false,
        ...args.options,
      }
    );
  },
};

import * as Yup from 'yup';
import { MessageFormSchema } from './validationSchemas';

export const validationMessageFormSchema: Yup.ObjectSchema<MessageFormSchema> =
  Yup.object().shape({
    message: Yup.string().required(),
  });

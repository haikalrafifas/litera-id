// interface FormattedResponse {
//   status?: number;
//   message: string;
//   data?: any;
// }

// export default function response({
//   status = 200,
//   message,
//   data = false,
// }: FormattedResponse) {
//   const payload: FormattedResponse = { status, message };
//   if (data) payload.data = data;

//   return new Response(JSON.stringify(payload), {
//     status,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

type BaseApiResponse = {
  success: boolean;
  message: string;
};

interface SuccessResponse extends BaseApiResponse {
  data?: any;
  pagination?: any;
}

interface ErrorResponse extends BaseApiResponse {
  errors?: any;
}

export default class ApiResponse {
  static response(
    status: number,
    payload: SuccessResponse | ErrorResponse,
  ): Response {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static success(
    message: string,
    data?: any,
    pagination?: any,
    status: number = 200,
  ): Response {
    const payload: SuccessResponse = {
      success: true,
      message,
    };

    if (data) payload.data = data;
    if (pagination) payload.pagination = pagination;

    return this.response(status, payload);
  }

  static error(
    status: number,
    message: string,
    errors?: any,
  ): Response {
    const payload: ErrorResponse = {
      success: false,
      message,
    };

    if (errors) payload.errors = errors;

    return this.response(status, payload);
  }
}

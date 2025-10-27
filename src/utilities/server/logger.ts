export default function logger(message: any) {
  if (process.env.LOGGER_ENABLE === 'true') {
    console.log(message);
  }
}

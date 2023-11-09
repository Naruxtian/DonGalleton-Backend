
interface ResponseDto<T = any> {
    code: number,
    success: boolean,
    data: T,
    message: string
}

export default ResponseDto;

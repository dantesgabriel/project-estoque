// Erro de negócio previsível (ex: email já cadastrado, credenciais inválidas).
// Diferente de um erro inesperado — este sempre vira uma resposta HTTP controlada.
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

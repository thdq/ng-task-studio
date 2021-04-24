export interface ValidationError {
    error: Error
    failedField: string
}

export interface Validation {
    validate (input: any): ValidationError
}

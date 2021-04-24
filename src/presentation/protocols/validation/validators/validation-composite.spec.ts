import { MissingParamsError } from "@/data/errors/missing-params-error"
import { Validation, ValidationError } from "@/validation/validation"
import { ValidationComposite } from "./validation-composite"

interface SutTypes {
    sut: ValidationComposite
    validationStub: Validation
}

const makeValidation = (): Validation => {
    
    class ValidationStub implements Validation {
        validate (input: any): ValidationError {
            return {
                error: null,
                failedField: ""
            }
        }
    }
    
    return new ValidationStub()
}

const makeSut = (): SutTypes => {
    
    const validationStub = makeValidation()
    const sut = new ValidationComposite([validationStub])
    
    return {
        sut,
        validationStub
    }
}

describe('Validation Composite', () => {
    
    test('Should return an error if any validation fails', () => {
        
        const { sut, validationStub } = makeSut()
        
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce({
            error: new MissingParamsError('field'),
            failedField: 'field'
        })
        
        const error = sut.validate({ field: '_any_value' })
        
        expect(error).toEqual({
            error: new MissingParamsError('field'),
            failedField: 'field'
        })
        
    })
    
    test('Should not return error if validation succeeds', () => {
        
        const { sut } = makeSut()
        
        const error = sut.validate({ field: '_any_value' })
        
        expect(error).toEqual({
            error: null,
            failedField: ""
        })
        
    })     
       
})

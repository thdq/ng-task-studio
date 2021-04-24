import { MissingParamsError } from "@/data/errors/missing-params-error"
import { RequiredFieldValidation } from "./required-field"
import faker from 'faker'

const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
    
    test('Should return a MissingParamsError if validation fails', () => {
        
        const sut = makeSut()
        
        const error = sut.validate({ title: faker.random.words() })
        
        expect(error).toEqual({
            error: new MissingParamsError('field'),
            failedField: "field"
        })
        
    })    
    
})

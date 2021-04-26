import { ValidationComposite, RequiredFieldValidation } from "@/presentation/protocols/validation/validators"
import { Validation } from "@/validation/validation"
import { makeCreateTaskValidation } from './create-task'

jest.mock('../../../presentation/protocols/validation/validators/validation-composite')

describe('CreateTaskListValidation Factory', () => {

    test('Should call ValidationComposite with all validatations', () => {

        makeCreateTaskValidation()

        const validations: Validation[] = []

        for (const field of ['title', 'listId']) {

            validations.push(new RequiredFieldValidation(field))

        }

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})

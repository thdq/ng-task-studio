import { ValidationComposite, RequiredFieldValidation } from "@/presentation/protocols/validation/validators"
import { Validation } from "@/validation/validation"

export const makeCreateTaskValidation = (): ValidationComposite => {

    const validations: Validation[] = []

    for (const field of ['title', 'listId']) {

        validations.push(new RequiredFieldValidation(field))

    }

    return new ValidationComposite(validations)
}

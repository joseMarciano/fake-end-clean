import { InvalidParamError } from '../errors/InvalidParamError'
import { Validator } from '../protocols'

export class CompareFieldsValidation implements Validator {
  private fieldName: string
  private fieldNameToCompare: string

  validate (input: any): Error | null {
    return input[this.fieldName] === input[this.fieldNameToCompare] ? null : new InvalidParamError(this.fieldNameToCompare)
  }

  static builder (): Builder {
    return new Builder(new CompareFieldsValidation())
  }

  set field (fieldName: string) {
    this.fieldName = fieldName
  }

  get field (): string {
    return this.fieldName
  }

  set fieldToCompare (fieldNameToCompare: string) {
    this.fieldNameToCompare = fieldNameToCompare
  }

  get fieldToCompare (): string {
    return this.fieldNameToCompare
  }
}

class Builder {
  constructor (
    private readonly compareFieldsValidation: CompareFieldsValidation
  ) { }

  field (fieldName: string): Builder {
    this.compareFieldsValidation.field = fieldName
    return this
  }

  fieldToCompare (fieldNameToCompare: string): Builder {
    this.compareFieldsValidation.fieldToCompare = fieldNameToCompare
    return this
  }

  build (): CompareFieldsValidation {
    return this.compareFieldsValidation
  }
}

import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min, min } from "class-validator";

export class CreateProductDto {


@IsString()
public name: string;

@IsNumber({
maxDecimalPlaces:4,
})
@Min(0)
@Type(() => Number)
public price: number;

}

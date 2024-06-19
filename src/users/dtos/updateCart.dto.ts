import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class UpdateCartDto {
    @IsNotEmpty({ message: 'Product ID should not be empty' })
    @IsString({ message: 'Product ID must be a string' })
    productId: string;

    @IsNotEmpty({ message: 'Quantity should not be empty' })
    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;
}

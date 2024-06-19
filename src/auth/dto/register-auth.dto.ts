import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAuthDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password should not be empty' })
    @MinLength(6, { message: 'Password should be at least 6 characters long' })
    password: string;

    @IsNotEmpty({ message: 'Address should not be empty' })
    address: string;

    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;
}

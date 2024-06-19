import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password should not be empty' })
    @MinLength(6, { message: 'Password should be at least 6 characters long' })
    password: string;
}

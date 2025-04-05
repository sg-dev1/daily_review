import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { FilterReviewSelectionStrategyType } from '../entities/user.entity';
import { UpdateUserDtoType } from '@repo/shared';

// TODO This should implement UpdateUserDtoType, however there is still the issue with
//    FilterReviewSelectionStrategyType
// https://github.com/nestjs/swagger/issues/1074#issuecomment-739850091
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  isDisabled?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  numReviewItemsToSend?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  // "0 30 11 * * 1-5"  --> Monday to Friday at 11:30am
  // "0 0 8 * * *"      --> Every day at 8:00am
  // "0 0 8 */2 * *"    --> Every second day at 8:00am (https://serverfault.com/a/204267)
  // "0 0 8 * * 0"      --> Every Sunday at 8:00am (https://crontab.guru/once-a-week)
  //
  // * * * * * *
  // - seconds (0-59)
  // - minutes (0-59)
  // - hours (0-23)
  // - day of month (1-31) (also allow */2 etc. - e.g. every second day)
  // - month (1-12)
  // - day of week (0-7) (where 0 and 7 is Sunday)
  @Matches(
    /^(\*|([0-5]?\d))( (\*|([0-5]?\d))){1}( (\*|([01]?\d|2[0-3]))){1}( (\*|([1-9]|[12]\d|3[01])|((\*\/[1-9]|[12]\d|3[01])|(\d+,\d+|([1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01])))))){1}( (\*|([1-9]|1[0-2]))){1}( (\*|([0-7])))$/,
  )
  reviewFreqAndTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  filterReviewSelectionStrategyType?: FilterReviewSelectionStrategyType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  filterReviewStrategyAuthor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  filterReviewStrategyTitle?: string;
}

import type { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';
import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

import { MAX_EXPECTED_CASE_LAW_FILE_SIZE } from '../../common/constants/files.constants';

export const parseDocumentMetadataFileValidators: FileValidator[] = [
  new FileTypeValidator({
    fileType: /^(text\/html|application\/pdf)$/i,
    // more info about "magic numbers" and default to mimetype:
    // https://stackoverflow.com/questions/79792873/validating-file-type-by-nestjs-with-uploadedfile-decorator
    fallbackToMimetype: true,
    errorMessage: 'Validation failed - Expected file: HTML or PDF',
  }),
  new MaxFileSizeValidator({
    maxSize: MAX_EXPECTED_CASE_LAW_FILE_SIZE,
  }),
];

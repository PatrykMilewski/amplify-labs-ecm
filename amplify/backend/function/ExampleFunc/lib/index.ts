import logger from '@dazn/lambda-powertools-logger';
import { DynamoDBStreamEvent } from 'aws-lambda';

export const handler = async (event: DynamoDBStreamEvent): Promise<string> => {
  logger.info('Input event', event);
  return 'Successfully processed DynamoDB record';
};

import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

import { SortingOrderType } from '../types/sorting.type';

export function appendOrderByClause<
  Entity extends ObjectLiteral,
  T extends keyof Entity,
>({
  selectQueryBuilder,
  entityAlias,
  sortingKeys,
  sortingOrder,
}: {
  selectQueryBuilder: SelectQueryBuilder<Entity>;
  entityAlias: string;
  sortingKeys: T[];
  sortingOrder: SortingOrderType[];
}): void {
  if (sortingKeys.length !== sortingOrder.length) {
    throw new Error(
      'The "sortingKeys" and "sortingOrder" are not of the same size',
    );
  }

  if (!sortingKeys.length) {
    return;
  }

  selectQueryBuilder.orderBy(
    `${entityAlias}.${sortingKeys[0].toString()}`,
    sortingOrder[0],
  );

  for (let i = 1; i < sortingKeys.length; i++) {
    selectQueryBuilder.addOrderBy(
      `${entityAlias}.${sortingKeys[i].toString()}`,
      sortingOrder[i],
    );
  }
}

import { container } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoruesRepository';
import { CategoriesRepository } from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import { SpecificationsRepository } from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationsRepository';

container.registerSingleton<ICategoriesRepository>(
    "CategoriesRepository",
    CategoriesRepository
);

container.registerSingleton<ISpecificationRepository>(
    "SpecificationsRepository",
    SpecificationsRepository
);

container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    UsersRepository
);

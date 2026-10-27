export interface Category {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly sortOrder: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateCategoryInput {
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly sortOrder: number;
  readonly isActive?: boolean;
}

export interface UpdateCategoryInput {
  readonly name?: string;
  readonly slug?: string;
  readonly description?: string;
  readonly sortOrder?: number;
  readonly isActive?: boolean;
}

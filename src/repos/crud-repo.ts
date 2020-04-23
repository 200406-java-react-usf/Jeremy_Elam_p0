export interface CrudRepository<T>{
    getAll(): Promise<T[]>;
    getById(id: number | string): Promise<T>;
    save(newObj: T): Promise<T>;
    update(updateObj: T):Promise<boolean>;
    deleteById(id: number | string): Promise<boolean>;
}
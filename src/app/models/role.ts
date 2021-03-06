export class Role {
    static readonly AccessItem = {
        User_Read: 'user.read',
        User_Write: 'user.write',
        Role_Read: 'role.read',
        Anouncement_Write: 'anouncement.write',
        Bill_Read: 'bill.read',
        Bill_Write: 'bill.write',
        BillItem_Read: 'bill_item.read',
        BillItem_Write: 'bill_item.write',
        Table_Read: 'table.read',
        Table_Write: 'table.write',
        Table_Write_Advanced: 'table.write.advanced',
    }

    id?: string;
    name: string;
    permissionList: string[];
    isDefault: boolean = false;
}

module.exports = class Serializer {
    static serialize( res ) {
        if (!res) return null;
        if (Array.isArray(res)) {
            return res.map(this.serializeItem)
        }
        return this.serializeItem(res);
    }

    static serializeItem( item ) {
        if (item._id) {
            item.id = item._id;
            delete item._id;
        }
        return item;
    }
};
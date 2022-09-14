export class XnAsset {

    /**
     * 把后台传过来的对象转成前台好用的格式
     * @param obj
     * @returns {any}
     */
    static convertAsset(obj) {
        if (obj.logs.length === 0) {
            return {
                createTime: obj.createTime,
                bcAssetId: obj.bcAssetId,
                assetCount: obj.assetCount,
                contractAmount: obj.assetCount,
                assetName: obj.assetName,
                assetUnit: obj.assetUnit,
                assetId: obj.assetId,
                supply_order: 0,
                stock_in: 0,
                stock_out: 0,
                transfer_stock: 0,
                dai_ding: obj.assetCount,
                ding_dan: 0,
                ku_cun: 0,
                chu_ku: 0,
                ji_ku: 0,
                logs: obj.logs
            };
        }

        let purchase_order = 0;
        let supply_order = 0;
        let stock_in = 0;
        let stock_out = 0;
        let transfer_stock = 0;

        const purchase_orderTimeArr: any = [];
        const supply_orderTimeArr: any = [];
        const stock_inTimeArr: any = [];
        const stock_outTimeArr: any = [];
        const transfer_stockTimeArr: any = [];
        const purchase_financeTimeArr: any = [];
        const supply_financeTimeArr: any = [];
        let transactionData: any;

        for (const log of obj.logs) {
            if (log.transactionData !== '') {
                transactionData = JSON.parse(log.transactionData);
            }

            if (log.transactionType === 'purchase_order') {
                purchase_order += log.amount;
                purchase_orderTimeArr.push({
                    type: 'purchase_order',
                    transactionTime: transactionData && transactionData.purchaseOrderTime,
                    amount: log.amount
                });
            } else if (log.transactionType === 'supply_order') {
                supply_order += log.amount;
                supply_orderTimeArr.push({
                    type: 'supply_order',
                    transactionTime: transactionData && transactionData.supplyOrderTime,
                    amount: log.amount
                });
            } else if (log.transactionType === 'stock_in') {
                stock_in += log.amount;
                stock_inTimeArr.push({
                    type: 'stock_in',
                    transactionTime: transactionData && transactionData.stockInTime,
                    amount: log.amount
                });
            } else if (log.transactionType === 'stock_out') {
                stock_out += log.amount;
                stock_outTimeArr.push({
                    type: 'stock_out',
                    transactionTime: transactionData && transactionData.stockOutTime,
                    amount: log.amount
                });
            } else if (log.transactionType === 'transfer_stock') {
                transfer_stock += log.amount;
                transfer_stockTimeArr.push({
                    type: 'transfer_stock',
                    transactionTime: transactionData && transactionData.transferStockTime,
                    amount: log.amount
                });
            } else if (log.transactionType === 'purchase_finance') {
                purchase_financeTimeArr.push({
                    type: 'purchase_finance',
                    transactionTime: transactionData && transactionData.paymentTime,
                    amount: transactionData.paymentAmount
                });
            } else if (log.transactionType === 'supply_finance') {
                supply_financeTimeArr.push({
                    type: 'supply_finance',
                    transactionTime: transactionData && transactionData.receivablesTime,
                    amount: transactionData.receivablesAmount
                });
            }
        }

        const dai_ding = obj.assetCount - supply_order;
        const ding_dan = supply_order - stock_in;
        const ku_cun = stock_in - (stock_out + transfer_stock);
        const chu_ku = stock_out;
        const ji_ku = transfer_stock;

        return {
            createTime: obj.createTime,
            bcAssetId: obj.bcAssetId,
            assetCount: obj.assetCount,
            contractAmount: obj.assetCount,
            assetName: obj.assetName,
            assetUnit: obj.assetUnit,
            assetId: obj.assetId,
            supply_order,
            stock_in,
            stock_out,
            transfer_stock,
            dai_ding,
            ding_dan,
            ku_cun,
            chu_ku,
            ji_ku,
            purchase_orderTimeArr,
            supply_orderTimeArr,
            stock_inTimeArr,
            stock_outTimeArr,
            transfer_stockTimeArr,
            purchase_financeTimeArr,
            supply_financeTimeArr,
            logs: obj.logs,
            relationPlatformSeq: obj.relationPlatformSeq
        };
    }
}

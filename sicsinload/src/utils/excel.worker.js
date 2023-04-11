import JSZip from 'jszip';

globalThis.onmessage = async function(e) {        
    const {action, excelDatas} = JSON.parse(e.data);
    switch(action) {
        case 'excelDownload': 
            const res =  await excelDownload(excelDatas) 
            globalThis.postMessage({action:'excelComplete', data: res});
            break;
    }        
}

const headerStyle = (colorCoded) => {
    return {
        font: {
            name: '맑은 고딕',
            bold: true,
            sz: 9,
        },
        fill: {
            patternType: 'solid',
            bgColor: { rgb: colorCoded },
            fgColor: { rgb: colorCoded },
        },
        alignment: {
            vertical: 'center',
            horizontal: 'center',
        },
        border: {
            top: {
                style: 'thin',
                color: { rgb: 'FF000000' },
            },
            left: {
                style: 'thin',
                color: { rgb: 'FF000000' },
            },
            right: {
                style: 'thin',
                color: { rgb: 'FF000000' },
            },
            bottom: {
                style: 'thin',
                color: { rgb: 'FF000000' },
            },
        },
    };
}

const excelDownload = async (datas) => {
    const xlsx = require('sheetjs-style-v2');
    let zip = new JSZip();
    const excelDatas = datas.slice()
    let wb = xlsx.utils.book_new();
    let ws;
    // 데이터 준비
    const sheetDatas = excelDatas.map((row, storeIndex) => {
        globalThis.postMessage({action:'progressBar', count: storeIndex});
        const store = new Store(row, storeIndex)
        return store
    })
    // 데이터 시트에 준비
    ws = xlsx.utils.json_to_sheet(sheetDatas, { origin: 'A2', skipHeader: false });
    xlsx.utils.sheet_add_aoa(ws,[['내주변 식당 정보']],{ origin: 'A1' })

    // cell 머지작업
    if(!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push({s: { r: 0, c: 0 }, e: { r: 0, c: 5 }});

    //디자인 먹이기
    const rangeRef = ws['!ref'];
    const range = xlsx.utils.decode_range(rangeRef);
    let columsW = [];
    let wsrows = [];
    for (let R = range.s.r; R <= range.e.r; ++R) {
        if (R === 0) wsrows.push({ hpt: 22 });
        else wsrows.push({ hpt: 18 });
        for (let C = range.s.c; C <= range.e.c; ++C) {
            try {
                const cell_address = { c: C, r: R };
                const cell_ref = xlsx.utils.encode_cell(cell_address);
                let cell = ws[cell_ref];

                if (!columsW[C]) columsW[C] = 0;

                switch (typeof cell.v) {
                    case 'string':
                        if (columsW[C] < cell.v.length)
                            // *1.5
                            columsW[C] = cell.v.length; /* *1.5 */
                        break;
                    case 'number':
                        if (columsW[C] < cell.v.length) columsW[C] = cell.v.length;
                        break;
                }

                if (R === 0) {
                    ws[cell_ref].s = headerStyle('FF556ee6')
                } else if (R === 1) {
                    ws[cell_ref].s = headerStyle('FFFAED7D')
                }else if ((C === range.e.c && R > 1)) {
                    ws[cell_ref].s = headerStyle('FFCCCCCC')
                } else {
                    ws[cell_ref].s = {
                        font: {
                            name: '맑은 고딕',
                            bold: false,
                            sz: 9,
                        },
                        alignment: {
                            vertical: 'center',
                            horizontal: 'center',
                        },
                    };
                }
            }catch (e) {
                console.log(e)
            }
        }
    }

    let wscols = [];
    columsW.map((v, i) => {
        wscols.push({ wch: parseInt(v) * 1.5 });
    });
 
    ws['!cols'] = wscols;
    ws['!rows'] = wsrows;

    xlsx.utils.book_append_sheet(wb, ws, `내주변 식당 정보`);
    const file = xlsx.write(wb, { bookType: 'xlsx', type: 'binary', compression: true });
    zip.file(`내주변 식당 정보.xlsx`, file, { binary: true });

    const r = await new Promise((resolve, reject) => {
        zip
            .generateAsync({ type: 'blob' })
            .then((content) => {
                resolve(content);
            }).catch(()=>{
                reject(null);
            });
        })
      
        return {result : r ? true : false, data: r};
}

class Store {
    constructor(storeData, storeIndex){
        this.No = storeIndex + 1 
        this['상호명'] = storeData.name
        this['주소'] = storeData.address
        this['전화번호'] = storeData.tel
        this['카테고리'] = `${storeData.category[0]} >> ${storeData.category[1]}`
        this['별점'] = (storeData.ratingAverage / 20).toFixed(2)
    }
}
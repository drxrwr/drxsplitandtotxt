'use strict';

const byId = id => document.getElementById(id);
const downloadUrls = { split: [], txt: [] };

function clearDownloads(kind) {
    downloadUrls[kind].forEach(url => URL.revokeObjectURL(url));
    downloadUrls[kind] = [];
    byId(kind === 'split' ? 'splitVcfFiles' : 'txtDownloadLink').replaceChildren();
}

function addDownload(kind, content, name, type) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(new Blob([content], { type }));
    downloadUrls[kind].push(url);
    link.href = url;
    link.download = name;
    link.textContent = kind === 'split' ? `Download ${name}` : 'Download TXT';
    byId(kind === 'split' ? 'splitVcfFiles' : 'txtDownloadLink').appendChild(link);
}

function parseCards(content) {
    const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    return normalized.match(/^BEGIN:VCARD[ \t]*\n[\s\S]*?^END:VCARD[ \t]*(?=\n|$)/gim) || [];
}

function splitFileName(name, additionalName, number) {
    const parts = name.trim().split('§').map(part => part.trim());
    let result = parts.length > 1 ? `${parts[0]} ${number}`
        : parts[0] ? `${parts[0]}${number}` : String(number);
    if (additionalName.trim()) result += ` ${additionalName.trim()}`;
    return `${result}.vcf`;
}

function phoneNumbersFromCards(cards) {
    const numbers = [];
    cards.forEach(card => {
        // vCard can wrap long property lines and include TEL parameters or a group.
        const unfolded = card.replace(/\n[ \t]/g, '');
        for (const line of unfolded.split('\n')) {
            const match = line.match(/^(?:[\w-]+\.)?TEL(?:;[^:]*)?:(.*)$/i);
            if (!match) continue;
            const number = match[1].trim().replace(/^tel:/i, '');
            if (number) numbers.push(number); // Preserve +, order, and duplicates.
        }
    });
    return numbers;
}

byId('vcfFileInput').addEventListener('change', () => clearDownloads('split'));
byId('vcfFileInputTxt').addEventListener('change', () => {
    clearDownloads('txt');
    byId('outputTextArea').value = '';
    byId('totalContacts').textContent = 'Total contacts: 0';
});

byId('splitButton').addEventListener('click', async () => {
    clearDownloads('split');
    const file = byId('vcfFileInput').files[0];
    const count = Number(byId('contactsPerFile').value);
    const startValue = byId('startNumberInput').value;
    const start = startValue === '' ? 1 : Number(startValue);
    if (!file || !Number.isSafeInteger(count) || count <= 0) {
        alert('Masukkan file VCF dan jumlah kontak per file yang valid!');
        return;
    }
    if (!Number.isSafeInteger(start) || start < 1) {
        alert('Nomor awal harus berupa bilangan bulat minimal 1!');
        return;
    }
    const name = byId('splitFileNameInput').value;
    const additionalName = byId('additionalFileNameInput').value;
    const button = byId('splitButton');
    button.disabled = true;
    try {
        const cards = parseCards(await file.text());
        if (byId('vcfFileInput').files[0] !== file) return;
        if (!cards.length) {
            alert('File VCF tidak berisi kontak yang valid!');
            return;
        }
        const lastNumber = start + Math.ceil(cards.length / count) - 1;
        if (!Number.isSafeInteger(lastNumber)) {
            alert('Nomor file terlalu besar. Kurangi nomor awal!');
            return;
        }
        for (let offset = 0; offset < cards.length; offset += count) {
            addDownload('split', cards.slice(offset, offset + count).join('\n') + '\n',
                splitFileName(name, additionalName, start + offset / count), 'text/vcard;charset=utf-8');
        }
    } catch (error) {
        clearDownloads('split');
        alert('File gagal dibaca. Silakan pilih ulang file VCF!');
    } finally {
        button.disabled = false;
    }
});

byId('convertButton').addEventListener('click', async () => {
    clearDownloads('txt');
    byId('outputTextArea').value = '';
    byId('totalContacts').textContent = 'Total contacts: 0';
    const file = byId('vcfFileInputTxt').files[0];
    if (!file) {
        alert('Silakan pilih file VCF untuk dikonversi!');
        return;
    }
    const name = byId('outputFileNameInput').value.trim();
    const button = byId('convertButton');
    button.disabled = true;
    try {
        const cards = parseCards(await file.text());
        if (byId('vcfFileInputTxt').files[0] !== file) return;
        const numbers = phoneNumbersFromCards(cards);
        const content = numbers.join('\n');
        byId('outputTextArea').value = content;
        byId('totalContacts').textContent = `Total contacts: ${numbers.length}`;
        if (!numbers.length) {
            alert('Tidak ada nomor telepon dalam file VCF ini!');
            return;
        }
        addDownload('txt', content, name ? `${name}.txt` : 'output.txt', 'text/plain;charset=utf-8');
    } catch (error) {
        alert('File gagal dibaca. Silakan pilih ulang file VCF!');
    } finally {
        button.disabled = false;
    }
});

export const slugifyVietnamese = (text) => {
    const from = "áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ";
    const to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD";

    // Replace special Vietnamese characters
    const newText = text.split('').map((char) => {
        const index = from.indexOf(char);
        return index > -1 ? to[index] : char;
    }).join('');

    return newText.normalize('NFD') // Normalize to NFD Unicode form
        .replace(/[\u0300-\u036f]/g, '') // Remove all diacritic marks
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-'); // Replace spaces with -
};

export const getExtension = (filename) => {
    return filename.split('.').pop();
};

$(document).ready(function () {
    $.ajax({
        url: 'JSON/data.json', 
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let perfumeGrid = $('#perfume-grid');
            perfumeGrid.empty(); 

            data.forEach(function (perfume) {
                let perfumeItem = `
                    <div class="perfume-item">
                        <img src="${perfume.image}" alt="${perfume.name}">
                        <h3>${perfume.name}</h3>
                        <p>${perfume.description}</p>
                        <p class="price">${perfume.price}</p>
                    </div>
                `;
                perfumeGrid.append(perfumeItem);
            });

            $('.featured-perfumes').addClass('active');
        },
        error: function (error) {
            console.error("Error loading perfume data:", error);
        }
    });
});

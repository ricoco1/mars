$(document).ready(function () {
    show_order();
});
function show_order() {
    $.ajax({
        type: 'GET',
        url: '/mars',
        data: {},
        success: function (response) {
            $('#order-box').empty();
            
            if (!response || !response['marsfields'] || response['marsfields'].length === 0) {
                $('#order-box').html('<tr><td colspan="3">Data masih kosong</td></tr>');
                return;
            }
            
            $.each(response['marsfields'], function(index, row) {
                let name = row['name'];
                let address = row['address'];
                let size = row['size'];
                let temp_html = `
                    <tr>
                        <td>${name}</td>
                        <td>${address}</td>
                        <td>${size}</td>
                    </tr>
                `;
                $('#order-box').append(temp_html);
            });
        }
    });
}

function save_order() {
    let name = $('#name').val();
    let address = $('#address').val();
    let size = $('#size').val();
    if (!name) {
        Swal.fire({
            title: 'Error',
            text: 'Nama wajib diisi',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!address) {
        Swal.fire({
            title: 'Error',
            text: 'Alamat wajib diisi',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (!size || size === '-- Select acreage --') {
        Swal.fire({
            title: 'Error',
            text: 'Pilih luas tanah yang valid',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    let spinner = new Spinner().spin();
     $('#loading').append(spinner.el);

    $.ajax({
        type: 'POST',
        url: '/mars',
        data: {
            name_give: name,
            address_give: address,
            size_give: size,
        },
        success: function (response) {
            spinner.stop();
            Swal.fire({
                title: 'Success',
                text: response['msg'],
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        }
    });
}
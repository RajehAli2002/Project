const jobsData = [
    { id: 1, title: "عامل بناء", field: "بناء", area: "غزة", days: "5 أيام", pay: "100 شيكل/يوم", status: "متاح", description: "مطلوب عامل بناء للمساعدة في ترميم منزل متضرر جزئياً في حي الرمال." },
    { id: 2, title: "فني كهرباء", field: "خدمات", area: "شمال غزة", days: "يوم واحد", pay: "150 شيكل", status: "متاح", description: "صيانة التمديدات الكهربائية لمركز إيواء." },
    { id: 3, title: "مدرس لغة إنجليزية", field: "تعليم", area: "الوسطى", days: "شهر", pay: "1200 شيكل", status: "متاح", description: "دروس تقوية للأطفال في مخيم النصيرات." },
    { id: 4, title: "ممرض منزلي", field: "صحة", area: "خانيونس", days: "أسبوعين", pay: "70 شيكل/يوم", status: "متاح", description: "متابعة حالة مريض كبار سن وتغيير على الجروح." },
    { id: 5, title: "مبرمج Front-End", field: "تكنولوجيا", area: "غزة", days: "مشروع", pay: "500 دولار", status: "مكتمل", description: "تطوير صفحة هبوط لمبادرة خيرية." },
    { id: 6, title: "سباك", field: "خدمات", area: "رفح", days: "3 أيام", pay: "300 شيكل", status: "متاح", description: "إصلاح شبكة مياه في بناية سكنية." },
    { id: 7, title: "متطوع توزيع طرود", field: "خدمات", area: "شمال غزة", days: "يومين", pay: "50 شيكل/يوم", status: "متاح", description: "مساعدة في تحميل وتوزيع الطرود الغذائية." },
    { id: 8, title: "مصمم جرافيك", field: "تكنولوجيا", area: "غزة", days: "عمل حر", pay: "200 شيكل", status: "متاح", description: "تصميم بوسترات لحملة توعية صحية." },
    { id: 9, title: "دهان", field: "بناء", area: "الوسطى", days: "أسبوع", pay: "800 شيكل", status: "متاح", description: "دهان 3 غرف وصالة." },
    { id: 10, title: "طبيب عام", field: "صحة", area: "خانيونس", days: "تطوع", pay: "بدون", status: "متاح", description: "يوم طبي مجاني في مراكز الإيواء." }
];

$(document).ready(function() {
    
    renderJobs(jobsData);
    populateJobSelect(jobsData);
    checkDarkMode();

    function renderJobs(data) {
        const tbody = $('#jobsTableBody');
        tbody.empty(); 

        if (data.length === 0) {
            $('#noJobsMsg').show();
        } else {
            $('#noJobsMsg').hide();
            data.forEach(job => {
                const statusBadge = job.status === "متاح" 
                    ? '<span class="badge bg-success">متاح</span>' 
                    : '<span class="badge bg-secondary">مكتمل</span>';
                
                const actionBtn = `<button class="btn btn-sm btn-primary details-btn" data-id="${job.id}" data-bs-toggle="modal" data-bs-target="#jobModal">تفاصيل</button>`;

                const row = `
                    <tr class="job-row" data-id="${job.id}">
                        <td>${job.id}</td>
                        <td>${job.title}</td>
                        <td>${job.field}</td>
                        <td>${job.area}</td>
                        <td>${job.days}</td>
                        <td>${job.pay}</td>
                        <td class="status-cell">${statusBadge}</td>
                        <td>${actionBtn}</td>
                    </tr>
                `;
                tbody.append(row);
            });
        }
    }

    function populateJobSelect(data) {
        const select = $('#jobSelect');
        select.find('option:not(:first)').remove();
        
        data.forEach(job => {
            if (job.status === "متاح") {
                select.append(`<option value="${job.id}">${job.title} - ${job.area}</option>`);
            }
        });
    }

    $('#filterField, #filterArea').on('change', function() {
        const fieldVal = $('#filterField').val();
        const areaVal = $('#filterArea').val();

        const filtered = jobsData.filter(job => {
            const matchField = fieldVal === "all" || job.field === fieldVal;
            const matchArea = areaVal === "all" || job.area === areaVal;
            return matchField && matchArea;
        });

        renderJobs(filtered);
    });

    $('#searchJob').on('input', function() {
        const term = $(this).val().toLowerCase();
        
        const filtered = jobsData.filter(job => {
            return job.title.toLowerCase().includes(term) || 
                   job.description.toLowerCase().includes(term);
        });

        renderJobs(filtered);
    });

 
    $(document).on('click', '.details-btn', function() {
        const jobId = $(this).data('id');
        const job = jobsData.find(j => j.id === jobId);

        if (job) {
            $('#modalTitle').text(job.title);
            $('#modalField').text(job.field);
            $('#modalArea').text(job.area);
            $('#modalDays').text(job.days);
            $('#modalPay').text(job.pay);
            $('#modalStatus').text(job.status);
            $('#modalDesc').text(job.description);
            
            $('#jobModal .btn-primary').off('click').on('click', function() {
                 $('#jobSelect').val(jobId);
                 $('html, body').animate({
                    scrollTop: $("#contact").offset().top
                }, 800);
            });
        }
    });

    $('#toggleTipsBtn').click(function() {
        $('#tipsSection').slideToggle();
    });

    $('#applyForm').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#name').val().trim();
        const phone = $('#phone').val().trim();
        const area = $('#area').val();
        const jobId = $('#jobSelect').val();
        
        let isValid = true;

        if (name.length < 3) {
            $('#name').addClass('is-invalid');
            isValid = false;
        } else {
            $('#name').removeClass('is-invalid');
        }

        if (phone.length < 10 || isNaN(phone)) {
            $('#phone').addClass('is-invalid');
            isValid = false;
        } else {
            $('#phone').removeClass('is-invalid');
        }

        if (!area || !jobId) {
            alert("يرجى اختيار المنطقة والوظيفة.");
            isValid = false;
        }

        if (isValid) {
            $('#formAlert').fadeIn().delay(3000).fadeOut();
            
            const jobIndex = jobsData.findIndex(j => j.id == jobId);
            if (jobIndex !== -1) {
                jobsData[jobIndex].status = "مكتمل";
                
                const row = $(`tr[data-id="${jobId}"]`);
                row.find('.status-cell').html('<span class="badge bg-secondary">مكتمل</span>');
                
                populateJobSelect(jobsData);
            }

            $('#applyForm')[0].reset();
        }
    });

    $('#darkModeToggle').click(function() {
        $('body').toggleClass('dark-mode');
        
        const icon = $(this).find('i');
        if ($('body').hasClass('dark-mode')) {
            icon.removeClass('fa-moon').addClass('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.removeClass('fa-sun').addClass('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    function checkDarkMode() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            $('body').addClass('dark-mode');
            $('#darkModeToggle i').removeClass('fa-moon').addClass('fa-sun');
        }
    }
});

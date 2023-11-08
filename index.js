(function() {
    const date = new Date();
    const dayOfWeek = ['U', 'M', 'T', 'W', 'R', 'F', 'S'][date.getDay()];
    const now = date.getHours() + 1/60 * date.getMinutes();

    for (let course of FA2023) {
        let foundSection;
        let foundTimeId;
        for (let section of course.sections) {
            for (let [i, time] of section.times.split("\n").entries()) {
                if (time.includes(dayOfWeek)) {
                    const parts = time.split(' ');
                    const [startHour, startMin] = parts[1].split(':').map(x => parseInt(x));
                    const start = startHour + 1/60*startMin;
                    const [endHour, endMin] = parts[3].split(':').map(x => parseInt(x));
                    const end = endHour + 1/60*endMin;
                    if (start <= now && end >= now) {
                        foundSection = section;
                        foundTimeId = i;
                        break;
                    }
                }
            }
            if (foundSection) {
                break;
            }
        }
        if (foundSection) {
            const elem = document.createElement('p');
            elem.innerText = course.name + ' | ' + foundSection.times.split('\n')[foundTimeId] + ' ' + foundSection.locations.split('\n')[foundTimeId];
            document.body.appendChild(elem);
        }
    }
})();
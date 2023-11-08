(function() {
    function td(text) {
        const elem = document.createElement('td');
        elem.innerText = text;
        return elem;
    }

    function displayCourse({course, foundSection, foundTimeId}) {
        const elem = document.createElement('tr');
        elem.appendChild(td(course.number));
        elem.appendChild(td(course.name));
        elem.appendChild(td(foundSection.locations.split('\n')[foundTimeId]));
        elem.appendChild(td(foundSection.times.split('\n')[foundTimeId]));
        document.getElementsByTagName('tbody')[0].appendChild(elem);
    }

    function findCourses(date) {
        const out = [];

        const dayOfWeek = ['U', 'M', 'T', 'W', 'R', 'F', 'S'][date.getDay()];
        const now = date.getHours() + 1/60 * date.getMinutes();

        for (let course of FA2023) {
            if (course.found) {
                continue;
            }

            let foundSection;
            let foundTimeId;
            for (let section of course.sections) {
                const locations = section.locations.split('\n');
                for (let [i, time] of section.times.split("\n").entries()) {
                    if (!time.startsWith('OM') && time.includes(dayOfWeek) && locations[i] !== 'A') {
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
                course.found = true;
                out.push({
                    course,
                    foundSection,
                    foundTimeId
                });
            }
        }
        return out;
    }

    for (let info of findCourses(new Date())) {
        displayCourse(info);
    }

    const upcoming = new Date();
    for (let i = 0; i < 6; i++) {
        for (let min of [30, 60, 30, 60]) {
            if (upcoming.getMinutes() >= min) {
                continue;
            }
            upcoming.setMinutes(min); // end of this hour
            const upcomingInfos = findCourses(upcoming);
            if (upcomingInfos.length) {
                const splitter = document.createElement('tr');
                splitter.classList.add('splitter');
                for (let i = 0; i < 4; i++) {
                    splitter.appendChild(td('_'));
                }
                document.getElementsByTagName('tbody')[0].appendChild(splitter);
                for (let info of upcomingInfos) {
                    displayCourse(info);
                }
            }
        }
    }
})();
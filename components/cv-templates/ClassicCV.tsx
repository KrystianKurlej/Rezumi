import { Font } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate, formatRichText, translate } from "@/lib/utils"
import { CVTemplateProps } from './index';

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: '/fonts/Roboto/Roboto-Regular.ttf',
        },
        {
            src: '/fonts/Roboto/Roboto-Bold.ttf',
            fontWeight: 'bold',
        },
        {
            src: '/fonts/Roboto/Roboto-Light.ttf',
            fontWeight: 'light',
        }
    ],
});

const classicStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 40,
        fontSize: 10,
        fontFamily: 'Roboto',
        hyphenate: false,
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    profilePhoto: {
        width: 100,
        height: 125,
        objectFit: 'cover',
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contactInfo: {
        marginTop: 6,
        gap: 2,
    },
    section: {
        marginTop: 8,
        paddingTop: 12,
        borderTop: '1px solid #e0e0e0',
    },
    sectionHeader: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    sectionItem: {
        paddingTop: 8,
    },
    sectionLastItem: {
        paddingTop: 8,
        paddingBottom: 8,
        borderBottom: '1px solid #f2f2f2',
    },
    sectionItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    sectionItemDescription: {
        marginTop: 4,
    },
    footer: {
        marginTop: 20,
        paddingTop: 12,
        borderTop: '1px solid #e0e0e0',
    },
    footerText: {
        fontSize: 8,
        color: 'gray',
    },
});

function formatRichTextSegments(text: string) {
  const segments = formatRichText(text);

  return segments.map((segment, index) => (
    <Text
        key={index}
        style={{
            fontWeight: segment.bold || segment.heading ? 'bold' : 'normal',
            fontStyle: segment.italic ? 'italic' : 'normal',
            fontSize: segment.heading ? 12 : 10,
            marginTop: segment.heading ? 8 : 0,
            marginBottom: segment.heading ? 4 : 0,
        }}
    >
        {segment.listItem ? '- ' : ''}
        {segment.text}
    </Text>
  ));
}

export default function ClassicCV({
    lang,
    personal,
    links,
    experiences,
    educations,
    courses,
    skills,
    freelance,
    footer
}: CVTemplateProps) {
    const socialLinks = [
        { label: 'LinkedIn', value: links.linkedin },
        { label: 'GitHub', value: links.github },
        { label: 'Portfolio', value: links.portfolio },
        { label: 'Website', value: links.website },
        { label: 'Twitter', value: links.twitter },
        { label: 'Facebook', value: links.facebook },
        { label: 'Instagram', value: links.instagram },
    ].filter((item) => Boolean(item.value))

    let skillsHasDescription = false;

    for (const skill of skills) {
        if (skill.skillName && skill.skillName.trim() !== '') {
            skillsHasDescription = true;
            break;
        }
    }

    return (
        <Document>
            <Page size="A4" style={classicStyles.page}>
                <View style={classicStyles.headerSection} wrap={false}>
                    {personal.photo && (
                        <Image
                            src={personal.photo}
                            style={classicStyles.profilePhoto}
                        />
                    )}
                    <View style={classicStyles.headerContent}>
                        <Text style={{ fontSize: 8, color: 'gray', marginBottom: 2 }}>
                            {personal.role || translate(lang, 'cv')}
                        </Text>
                        <Text style={classicStyles.title}>
                            {personal.firstName} {personal.lastName}
                        </Text>
                        
                        <View style={classicStyles.contactInfo}>
                            {personal.email && <Text>{personal.email}</Text>}
                            {personal.phone && <Text>{personal.phone}</Text>}
                            {socialLinks.map((link) => (
                                <Text key={link.label}>{link.label}: {link.value}</Text>
                            ))}
                        </View>

                        {personal.aboutDescription && (
                            <Text style={{ marginTop: 8 }}>
                                {personal.aboutDescription}
                            </Text>
                        )}
                    </View>
                </View>

                {experiences.length > 0 && (
                    <View style={classicStyles.section} wrap={false}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'experience')}
                        </Text>
                        {experiences.map((experience) => (
                            <View key={experience.id} style={experiences[experiences.length - 1].id === experience.id ? classicStyles.sectionItem : classicStyles.sectionLastItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>
                                            {experience.title} · {experience.company}
                                        </Text>
                                    </View>
                                    <Text>
                                        {formatDate(experience.startDate, 'short')} - {experience.isOngoing ? translate(lang, 'present') : formatDate(experience.endDate, 'short')}
                                    </Text>
                                </View>
                                {experience.description && (
                                    <Text style={classicStyles.sectionItemDescription}>{experience.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {educations.length > 0 && (
                    <View style={classicStyles.section} wrap={false}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'education')}
                        </Text>
                        {educations.map((education) => (
                            <View key={education.id} style={educations[educations.length - 1].id === education.id ? classicStyles.sectionItem : classicStyles.sectionLastItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>
                                            {education.degree} · {education.fieldOfStudy}
                                        </Text>
                                        <Text style={{ marginTop: 2, fontSize: 10 }}>{education.institution}</Text>
                                    </View>
                                    <Text>
                                        {formatDate(education.startDate, 'short')} - {education.isOngoing ? translate(lang, 'present') : formatDate(education.endDate, 'short')}
                                    </Text>
                                </View>
                                {education.description && (
                                    <Text style={classicStyles.sectionItemDescription}>{education.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {courses.length > 0 && (
                    <View style={classicStyles.section} wrap={false}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'courses_certifications')}
                        </Text>
                        {courses.map((course) => (
                            <View key={course.id} style={courses[courses.length - 1].id === course.id ? classicStyles.sectionItem : classicStyles.sectionLastItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{course.courseName}</Text>
                                        <Text style={{ marginTop: 2, fontSize: 10 }}>{course.platform}</Text>
                                    </View>
                                    <Text>
                                        {course.isOngoing ? translate(lang, 'in_progress') : `${translate(lang, 'completed')}: ${formatDate(course.completionDate, 'short')}`}
                                    </Text>
                                </View>
                                {course.description && (
                                    <Text style={classicStyles.sectionItemDescription}>{course.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {skills.length > 0 && skillsHasDescription && (
                    <View style={classicStyles.section} wrap={false}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'skills')}
                        </Text>
                        <View style={{ marginTop: 8 }}>
                            {skills.map((skill) => (
                                <View key={skill.id} style={{ marginBottom: 4, borderLeft: '1px solid #e0e0e0', paddingLeft: 4, flexDirection: 'row', flexWrap: 'nowrap', gap: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {skill.skillName}:
                                    </Text>
                                    <Text>
                                        {skill.description}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {skills.length > 0 && !skillsHasDescription && (
                    <View style={classicStyles.section} wrap={false}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'skills')}
                        </Text>
                        <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
                            {skills.map((skill) => (
                                <Text key={skill.id} style={{ marginRight: 6, marginBottom: 4 }}>
                                    • {skill.skillName}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {freelance.freelanceText && (
                    <View style={classicStyles.section} wrap={false}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'freelance')}
                        </Text>
                        <View style={{ marginTop: 8 }}>
                            {formatRichTextSegments(freelance.freelanceText)}
                        </View>
                    </View>
                )}

                {footer.footerText && (
                    <View style={classicStyles.footer} wrap={false}>
                        <Text style={classicStyles.footerText}>{footer.footerText}</Text>
                    </View>
                )}
                
                <Text
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        right: 30,
                        fontSize: 8,
                        color: 'gray',
                    }}
                    render={({ pageNumber, totalPages }) => 
                        totalPages > 1 ? `${pageNumber}/${totalPages}` : ''
                    }
                    fixed
                />
            </Page>
        </Document>
    )
}

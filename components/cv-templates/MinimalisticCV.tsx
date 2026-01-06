import { Font, Path } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image, Svg } from '@react-pdf/renderer';
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
    ],
});

Font.register({
    family: 'Playfair Display',
    fonts: [
        {
            src: '/fonts/PlayfairDisplay/PlayfairDisplay-Regular.ttf',
        },
        {
            src: '/fonts/PlayfairDisplay/PlayfairDisplay-Bold.ttf',
            fontWeight: 'bold',
        },
    ],
});

const minimalisticStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 40,
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'light',
    },
    headerSection: {
        marginBottom: 20,
        alignItems: 'center',
    },
    profilePhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        objectFit: 'cover',
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    contentSection: {
        borderTop: '1px solid lightgray',
        flexDirection: 'row',
    },
    columnLeft: {
        width: '35%',
        paddingRight: 20,
        borderRight: '1px solid lightgray',
        paddingTop: 10,
    },
    columnRight: {
        width: '65%',
        paddingLeft: 20,
        paddingTop: 10,
    },
    columnSection: {
        borderBottom: '1px solid lightgray',
        paddingTop: 10,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        paddingBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: .5
    },
    sectionItem: {
        paddingTop: 6,
        paddingBottom: 6,
    },
    sectionItemContent: {
        color: '#555555',
    },
    sectionItemHeader: {
        marginBottom: 4,
    },
    footer: {
        marginTop: 12,
    },
    footerText: {
        fontSize: 8,
        color: 'gray',
        textAlign: 'center',
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

export default function MinimalisticCV({
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
            <Page size="A4" style={minimalisticStyles.page}>
                <View style={minimalisticStyles.headerSection}>
                    {personal.photo && (
                        <Image
                            src={personal.photo}
                            style={minimalisticStyles.profilePhoto}
                        />
                    )}
                    <Text>{personal.role || translate(lang, 'cv')}</Text>
                    <Text style={minimalisticStyles.title}>{personal.firstName}</Text>
                    <Text style={minimalisticStyles.title}>{personal.lastName}</Text>
                </View>
                <View style={minimalisticStyles.contentSection}>
                    <View style={minimalisticStyles.columnLeft}>
                        <View style={minimalisticStyles.columnSection}>
                            {personal.email && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                        <Path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2" />
                                    </Svg>
                                    <Text>{personal.email}</Text>
                                </View>
                            )}
                            {personal.phone && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                        <Path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 16.92v3a2 2 0 0 1-2.18 2a19.79 19.79 0 0 1-8.63-3.07a19.5 19.5 0 0 1-6-6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72a12.84 12.84 0 0 0 .7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45a12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92" />
                                    </Svg>
                                    <Text>{personal.phone}</Text>
                                </View>
                            )}
                            {socialLinks.map((link) => (
                                <View key={link.label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }} wrap={false}>
                                    <Text style={{ fontWeight: 'bold', marginRight: 4 }}>{link.label}:</Text>
                                    <Text>{link.value}</Text>
                                </View>
                            ))}
                        </View>
                        {personal.aboutDescription && (
                            <View style={minimalisticStyles.columnSection} wrap={false}>
                                <Text style={{ marginBottom: 4 }}>{personal.aboutDescription}</Text>
                            </View>
                        )}
                        {skills.length > 0 && !skillsHasDescription && (
                            <View style={minimalisticStyles.columnSection} wrap={false}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'skills')}
                                </Text>
                                {skills.map((skill) => (
                                    <Text key={skill.id} style={{ marginBottom: 2 }}>
                                        • {skill.skillName}
                                    </Text>
                                ))}
                            </View>
                        )}
                        {skills.length > 0 && skillsHasDescription && (
                            <View style={minimalisticStyles.columnSection} wrap={false}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'skills')}
                                </Text>
                                {skills.map((skill) => (
                                    <div key={skill.id} >
                                        <Text style={{ marginRight: 8, marginBottom: 4, fontWeight: 'bold' }}>
                                            {skill.skillName}
                                        </Text>
                                        <Text style={{ marginRight: 8, marginBottom: 4 }}>
                                            {skill.description}
                                        </Text>
                                    </div>
                                ))}
                            </View>
                        )}
                    </View>
                    <View style={minimalisticStyles.columnRight}>
                        {experiences.length > 0 && (
                            <View style={minimalisticStyles.columnSection} wrap={false}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'experience')}
                                </Text>
                                {experiences.map((experience) => (
                                    <View key={experience.id} style={minimalisticStyles.sectionItem}>
                                        <View style={minimalisticStyles.sectionItemHeader}>
                                            <Text style={{ fontWeight: 'bold' }}>{experience.title}</Text>
                                            <Text>{experience.company} | {formatDate(experience.startDate, 'short')} - {experience.isOngoing ? translate(lang, 'present') : formatDate(experience.endDate, 'short')}</Text>
                                        </View>
                                        <Text style={minimalisticStyles.sectionItemContent}>{experience.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {educations.length > 0 && (
                            <View style={minimalisticStyles.columnSection} wrap={false}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'education')}
                                </Text>
                                {educations.map((education) => (
                                    <View key={education.id} style={minimalisticStyles.sectionItem}>
                                        <View style={minimalisticStyles.sectionItemHeader}>
                                            <Text style={{ fontWeight: 'bold' }}>{education.degree} | {education.fieldOfStudy}</Text>
                                            <Text>{education.institution} | {formatDate(education.startDate, 'short')} - {education.isOngoing ? translate(lang, 'present') : formatDate(education.endDate, 'short')}</Text>
                                        </View>
                                        <Text>{education.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {courses.length > 0 && (
                            <View style={minimalisticStyles.columnSection} wrap={false}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'courses_certifications')}
                                </Text>
                                {courses.map((course) => (
                                    <View key={course.id}>
                                        <View style={minimalisticStyles.sectionItemHeader}>
                                            <Text style={{ fontWeight: 'bold' }}>{course.courseName}</Text>
                                            <Text>{course.platform} | {course.isOngoing ? translate(lang, 'in_progress') : `${translate(lang, 'completed')}: ${formatDate(course.completionDate, 'short')}`}</Text>
                                        </View>
                                        {course.description && <Text>{course.description}</Text>}
                                    </View>
                                ))}
                            </View>
                        )}
                        {freelance.freelanceText && (
                            <View style={minimalisticStyles.columnSection} wrap={false}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'freelance')}
                                </Text>
                                {formatRichTextSegments(freelance.freelanceText)}
                            </View>
                        )}
                    </View>
                </View>

                {footer.footerText && (
                    <View style={minimalisticStyles.footer} wrap={false}>
                        <Text style={minimalisticStyles.footerText}>{footer.footerText}</Text>
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

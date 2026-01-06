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
                                    {link.label == "LinkedIn" && (
                                        <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                            <Path fill="#000" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"/>
                                        </Svg>
                                    )}
                                    {link.label == "GitHub" && (
                                        <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                            <Path fill="#000" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/>
                                        </Svg>
                                    )}
                                    {link.label == "Portfolio" && (
                                        <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                            <Path fill="#000" d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>
                                        </Svg>
                                    )}
                                    {link.label == "Website" && (
                                        <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                            <Path fill="#000" d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>
                                        </Svg>
                                    )}
                                    {link.label == "Twitter" && (
                                        <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                            <Path fill="#000" d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"/>
                                        </Svg>
                                    )}
                                    {link.label == "Facebook" && (
                                        <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                            <Path fill="#000" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/>
                                        </Svg>
                                    )}
                                    {link.label == "Instagram" && (
                                        <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                            <Path fill="#000" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/>
                                        </Svg>
                                    )}
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

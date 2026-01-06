import { Font, Path, Svg } from '@react-pdf/renderer';
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

const confidentStyles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        fontSize: 10,
        fontFamily: 'Roboto',
    },
    
    // Sidebar (lewa kolumna)
    sidebar: {
        width: '33%',
        backgroundColor: '#2C3E50',
        color: '#ffffff',
        padding: 30,
    },
    initialsCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        border: '1px solid #ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    photoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        objectFit: 'cover',
        alignSelf: 'center',
        marginBottom: 16,
    },
    initials: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'light',
        textTransform: 'uppercase',
    },
    sidebarSection: {
        marginBottom: 8,
    },
    sidebarSectionTitle: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 6,
    },
    sidebarItem: {
        marginBottom: 6,
    },
    sidebarItemContact: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    sidebarItemLabel: {
        fontSize: 10,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    sidebarItemValue: {
        fontSize: 9,
        color: '#d1d5db',
    },
    
    // Main content (prawa kolumna)
    mainContent: {
        width: '67%',
        padding: 30,
        backgroundColor: '#ffffff',
    },
    fullName: {
        fontSize: 28,
        color: '#333333',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    jobTitle: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#6b7280',
    },
    contactLine: {
        fontSize: 9,
        color: '#6b7280',
        flexDirection: 'row',
        gap: 8,
    },
    
    // Sekcje główne
    mainSection: {
        marginBottom: 12,
    },
    mainSectionTitle: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#6b7280',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    summaryText: {
        fontSize: 9,
        color: '#333333',
        lineHeight: 1.2,
        marginTop: 4,
    },
    
    // Timeline
    timelineContainer: {
        position: 'relative',
        padding: 10,
    },
    timelineLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 4,
        width: 1,
        backgroundColor: '#d1d5db',
    },
    timelineItem: {
        position: 'relative',
        marginBottom: 8,
    },
    timelineContent: {
        paddingLeft: 4,
    },
    entryTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 2,
    },
    entrySubtitle: {
        fontSize: 10,
        color: '#4b5563',
        marginBottom: 4,
    },
    entryMeta: {
        fontSize: 9,
        color: '#6b7280',
        marginBottom: 6,
    },
    entryDescription: {
        fontSize: 9,
        color: '#4b5563',
        lineHeight: 1.5,
    },
    footer: {
        marginTop: 24,
        paddingTop: 12,
        borderTop: '1px solid #e5e7eb',
    },
    footerText: {
        fontSize: 8,
        color: '#9ca3af',
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

export default function ConfidentCV({
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
    
    const initials = `${personal.firstName?.[0] || ''}${personal.lastName?.[0] || ''}`;

    let skillsHasDescription = false;

    for (const skill of skills) {
        if (skill.skillName && skill.skillName.trim() !== '') {
            skillsHasDescription = true;
            break;
        }
    }
    
    return (
        <Document>
            <Page size="A4" style={confidentStyles.page}>
                {/* Sidebar - Lewa Kolumna */}
                <View style={confidentStyles.sidebar}>
                    {/* Logo/Inicjały/Obraz profilowy */}
                    {personal.photo ? (
                        <Image
                            src={personal.photo}
                            style={confidentStyles.photoCircle}
                        />
                    ) : (
                        <View style={confidentStyles.initialsCircle}>
                            <Text style={confidentStyles.initials}>{initials}</Text>
                        </View>
                    )}

                    {/* Contact */}
                    <View style={confidentStyles.sidebarSection}>
                        <Text style={confidentStyles.sidebarSectionTitle}>
                            {translate(lang, 'contact')}
                        </Text>
                        {personal.phone && (
                            <View style={confidentStyles.sidebarItemContact}>
                                <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                    <Path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 16.92v3a2 2 0 0 1-2.18 2a19.79 19.79 0 0 1-8.63-3.07a19.5 19.5 0 0 1-6-6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72a12.84 12.84 0 0 0 .7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45a12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92" />
                                </Svg>
                                <Text style={confidentStyles.sidebarItemValue}>
                                    {personal.phone}
                                </Text>
                            </View>
                        )}
                        {personal.email && (
                            <View style={confidentStyles.sidebarItemContact}>
                                <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                                    <Path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2" />
                                </Svg>
                                <Text style={confidentStyles.sidebarItemValue}>
                                    {personal.email}
                                </Text>
                            </View>
                        )}
                        {socialLinks.map((link) => (
                            <View key={link.label} style={confidentStyles.sidebarItemContact}>
                                <Text style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: 10 }}>
                                    {link.label}
                                </Text>
                                <Text style={confidentStyles.sidebarItemValue}>{link.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Skills */}
                    {skills.length > 0 && !skillsHasDescription && (
                        <View style={confidentStyles.sidebarSection}>
                            <Text style={confidentStyles.sidebarSectionTitle}>
                                {translate(lang, 'skills')}
                            </Text>
                            <View>
                                {skills.map((skill) => (
                                    <Text key={skill.id} style={{ marginBottom: 4 }}>
                                        • {skill.skillName}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}
                    {skills.length > 0 && skillsHasDescription && (
                        <View style={confidentStyles.sidebarSection}>
                            <Text style={confidentStyles.sidebarSectionTitle}>
                                {translate(lang, 'skills')}
                            </Text>
                            <View>
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
                        </View>
                    )}

                    {/* Freelance */}
                    {freelance.freelanceText && (
                        <View style={confidentStyles.sidebarSection}>
                            <Text style={confidentStyles.sidebarSectionTitle}>
                                {translate(lang, 'freelance')}
                            </Text>
                            <View>
                                {formatRichTextSegments(freelance.freelanceText)}
                            </View>
                        </View>
                    )}
                </View>

                {/* Main Content - Prawa Kolumna */}
                <View style={confidentStyles.mainContent}>
                    {/* Header */}
                    <View>
                        <Text style={confidentStyles.jobTitle}>
                            {personal.role || translate(lang, 'cv')}
                        </Text>
                        <Text style={confidentStyles.fullName}>
                            {personal.firstName} {personal.lastName}
                        </Text>
                    </View>

                    {/* Summary */}
                    {personal.aboutDescription && (
                        <View style={confidentStyles.mainSection}>
                            <Text style={confidentStyles.summaryText}>
                                {personal.aboutDescription}
                            </Text>
                        </View>
                    )}

                    {/* Experience */}
                    {experiences.length > 0 && (
                        <View style={confidentStyles.mainSection}>
                            <Text style={confidentStyles.mainSectionTitle}>
                                {translate(lang, 'experience')}
                            </Text>
                            <View style={confidentStyles.timelineContainer}>
                                <View style={confidentStyles.timelineLine} />
                                {experiences.map((experience) => (
                                    <View key={experience.id} style={confidentStyles.timelineItem}>
                                        <View style={confidentStyles.timelineContent}>
                                            <Text style={confidentStyles.entryTitle}>
                                                {experience.title}
                                            </Text>
                                            <Text style={confidentStyles.entrySubtitle}>
                                                {experience.company}
                                            </Text>
                                            <Text style={confidentStyles.entryMeta}>
                                                {formatDate(experience.startDate, 'short')} - {experience.isOngoing ? translate(lang, 'present') : formatDate(experience.endDate, 'short')}
                                            </Text>
                                            {experience.description && (
                                                <Text style={confidentStyles.entryDescription}>
                                                    {experience.description}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Education */}
                    {educations.length > 0 && (
                        <View style={confidentStyles.mainSection}>
                            <Text style={confidentStyles.mainSectionTitle}>
                                {translate(lang, 'education')}
                            </Text>
                            <View style={confidentStyles.timelineContainer}>
                                <View style={confidentStyles.timelineLine} />
                                {educations.map((education) => (
                                    <View key={education.id} style={confidentStyles.timelineItem}>
                                        <View style={confidentStyles.timelineContent}>
                                            <Text style={confidentStyles.entryTitle}>
                                                {education.degree} - {education.fieldOfStudy}
                                            </Text>
                                            <Text style={confidentStyles.entrySubtitle}>
                                                {education.institution}
                                            </Text>
                                            <Text style={confidentStyles.entryMeta}>
                                                {formatDate(education.startDate, 'short')} - {education.isOngoing ? translate(lang, 'present') : formatDate(education.endDate, 'short')}
                                            </Text>
                                            {education.description && (
                                                <Text style={confidentStyles.entryDescription}>
                                                    {education.description}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Courses */}
                    {courses.length > 0 && (
                        <View style={confidentStyles.mainSection}>
                            <Text style={confidentStyles.mainSectionTitle}>
                                {translate(lang, 'courses_certifications')}
                            </Text>
                            <View style={confidentStyles.timelineContainer}>
                                <View style={confidentStyles.timelineLine} />
                                {courses.map((course) => (
                                    <View key={course.id} style={confidentStyles.timelineItem}>
                                        <View style={confidentStyles.timelineContent}>
                                            <Text style={confidentStyles.entryTitle}>
                                                {course.courseName}
                                            </Text>
                                            <Text style={confidentStyles.entrySubtitle}>
                                                {course.platform}
                                            </Text>
                                            <Text style={confidentStyles.entryMeta}>
                                                {course.isOngoing ? translate(lang, 'in_progress') : `${translate(lang, 'completed')}: ${formatDate(course.completionDate, 'short')}`}
                                            </Text>
                                            {course.description && (
                                                <Text style={confidentStyles.entryDescription}>
                                                    {course.description}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Footer */}
                    {footer.footerText && (
                        <View style={confidentStyles.footer}>
                            <Text style={confidentStyles.footerText}>{footer.footerText}</Text>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    )
}

import { Font, Path, Svg } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate, formatRichText, translate } from "@/lib/utils"
import { PersonalInfo } from '@/lib/slices/personalSlice';
import { DBExperience, DBEducation, DBCourse } from '@/lib/db';
import { Skills } from '@/lib/slices/skillsSlice';
import { Footer } from '@/lib/slices/footerSlice';
import { Freelance } from '@/lib/slices/freelanceSlice';

export interface CVTemplateProps {
    lang: string;
    personal: PersonalInfo;
    experiences: DBExperience[];
    educations: DBEducation[];
    courses: DBCourse[];
    skills: Skills;
    freelance: Freelance;
    footer: Footer;
}

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
        padding: 32,
    },
    initialsCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        border: '2px solid #ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 32,
    },
    initials: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    sidebarSection: {
        marginBottom: 24,
    },
    sidebarSectionTitle: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 12,
    },
    sidebarItem: {
        marginBottom: 10,
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
        padding: 40,
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 32,
    },
    fullName: {
        fontSize: 36,
        fontWeight: 'light',
        color: '#333333',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    jobTitle: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#6b7280',
        marginBottom: 12,
    },
    contactLine: {
        fontSize: 9,
        color: '#6b7280',
        flexDirection: 'row',
        gap: 8,
    },
    
    // Sekcje główne
    mainSection: {
        marginTop: 24,
    },
    mainSectionTitle: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#6b7280',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    summaryText: {
        fontSize: 10,
        color: '#333333',
        lineHeight: 1.6,
    },
    
    // Timeline
    timelineContainer: {
        position: 'relative',
        paddingLeft: 20,
    },
    timelineLine: {
        position: 'absolute',
        left: 4,
        top: 4,
        bottom: 4,
        width: 2,
        backgroundColor: '#d1d5db',
    },
    timelineItem: {
        position: 'relative',
        marginBottom: 20,
    },
    timelineDot: {
        position: 'absolute',
        left: -16,
        top: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        border: '2px solid #d1d5db',
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

export default function ConfidentCV({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    freelance,
    footer
}: CVTemplateProps) {
    const initials = `${personal.firstName?.[0] || ''}${personal.lastName?.[0] || ''}`;
    
    return (
        <Document>
            <Page size="A4" style={confidentStyles.page}>
                {/* Sidebar - Lewa Kolumna */}
                <View style={confidentStyles.sidebar}>
                    {/* Logo/Inicjały */}
                    <View style={confidentStyles.initialsCircle}>
                        <Text style={confidentStyles.initials}>{initials}</Text>
                    </View>

                    {/* Skills */}
                    {skills.skillsText && (
                        <View style={confidentStyles.sidebarSection}>
                            <Text style={confidentStyles.sidebarSectionTitle}>
                                {translate(lang, 'skills')}
                            </Text>
                            <View>
                                {formatRichText(skills.skillsText).map((segment, index) => (
                                    <Text
                                        key={index}
                                        style={{
                                            fontSize: 9,
                                            color: segment.bold ? '#ffffff' : '#d1d5db',
                                            fontWeight: segment.bold ? 'bold' : 'normal',
                                            fontStyle: segment.italic ? 'italic' : 'normal',
                                            marginBottom: 2,
                                        }}
                                    >
                                        {segment.text}
                                    </Text>
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
                                {formatRichText(freelance.freelanceText).map((segment, index) => (
                                    <Text
                                        key={index}
                                        style={{
                                            fontSize: 9,
                                            color: segment.bold ? '#ffffff' : '#d1d5db',
                                            fontWeight: segment.bold ? 'bold' : 'normal',
                                            fontStyle: segment.italic ? 'italic' : 'normal',
                                            marginBottom: 2,
                                        }}
                                    >
                                        {segment.text}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Contact */}
                    <View style={confidentStyles.sidebarSection}>
                        <Text style={confidentStyles.sidebarSectionTitle}>
                            {translate(lang, 'contact')}
                        </Text>
                        {personal.phone && (
                            <View style={confidentStyles.sidebarItem}>
                                <Text style={confidentStyles.sidebarItemLabel}>
                                    {translate(lang, 'phone')}
                                </Text>
                                <Text style={confidentStyles.sidebarItemValue}>
                                    {personal.phone}
                                </Text>
                            </View>
                        )}
                        {personal.email && (
                            <View style={confidentStyles.sidebarItem}>
                                <Text style={confidentStyles.sidebarItemLabel}>
                                    {translate(lang, 'email')}
                                </Text>
                                <Text style={confidentStyles.sidebarItemValue}>
                                    {personal.email}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Main Content - Prawa Kolumna */}
                <View style={confidentStyles.mainContent}>
                    {/* Header */}
                    <View style={confidentStyles.header}>
                        <Text style={confidentStyles.fullName}>
                            {personal.firstName} {personal.lastName}
                        </Text>
                        <Text style={confidentStyles.jobTitle}>
                            {translate(lang, 'cv')}
                        </Text>
                    </View>

                    {/* Summary */}
                    {personal.aboutDescription && (
                        <View style={confidentStyles.mainSection}>
                            <Text style={confidentStyles.mainSectionTitle}>
                                {translate(lang, 'summary')}
                            </Text>
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
                                        <View style={confidentStyles.timelineDot} />
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
                                        <View style={confidentStyles.timelineDot} />
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
                                        <View style={confidentStyles.timelineDot} />
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

import { Font } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate, formatRichText, translate } from "@/lib/utils"
import { PersonalInfo } from '@/lib/slices/personalSlice';
import { DBExperience, DBEducation, DBCourse } from '@/lib/db';
import { Skills } from '@/lib/slices/skillsSlice';
import { Footer } from '@/lib/slices/footerSlice';

export interface CVTemplateProps {
    lang: string;
    personal: PersonalInfo;
    experiences: DBExperience[];
    educations: DBEducation[];
    courses: DBCourse[];
    skills: Skills;
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

const classicStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 40,
        fontSize: 10,
        fontFamily: 'Roboto',
    },
    headerSection: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
        gap: 16,
    },
    headerContent: {
        flex: 1,
    },
    profilePhoto: {
        width: 80,
        height: 80,
        objectFit: 'cover',
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
        marginTop: 16,
        paddingTop: 12,
        borderTop: '1px solid #e0e0e0',
    },
    sectionHeader: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionItem: {
        paddingTop: 8,
        paddingBottom: 8,
    },
    sectionItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        gap: 8,
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

export default function ClassicCV({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    footer
}: CVTemplateProps) {
    return (
        <Document>
            <Page size="A4" style={classicStyles.page}>
                <View style={classicStyles.headerSection}>
                    {personal.photo && (
                        <Image
                            src={personal.photo}
                            style={classicStyles.profilePhoto}
                        />
                    )}
                    <View style={classicStyles.headerContent}>
                        <Text style={{ fontSize: 8, color: 'gray', marginBottom: 2 }}>
                            {translate(lang, 'cv')}
                        </Text>
                        <Text style={classicStyles.title}>
                            {personal.firstName} {personal.lastName}
                        </Text>
                        
                        <View style={classicStyles.contactInfo}>
                            {personal.email && <Text>{personal.email}</Text>}
                            {personal.phone && <Text>{personal.phone}</Text>}
                        </View>

                        {personal.aboutDescription && (
                            <Text style={{ marginTop: 8 }}>
                                {personal.aboutDescription}
                            </Text>
                        )}
                    </View>
                </View>

                {experiences.length > 0 && (
                    <View style={classicStyles.section}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'experience')}
                        </Text>
                        {experiences.map((experience, index) => (
                            <View key={experience.id} style={classicStyles.sectionItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>
                                            {experience.title} · {experience.company}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 9, color: 'gray' }}>
                                        {formatDate(experience.startDate, 'short')} - {experience.isOngoing ? translate(lang, 'present') : formatDate(experience.endDate, 'short')}
                                    </Text>
                                </View>
                                {experience.description && (
                                    <Text>{experience.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {educations.length > 0 && (
                    <View style={classicStyles.section}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'education')}
                        </Text>
                        {educations.map((education) => (
                            <View key={education.id} style={classicStyles.sectionItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>
                                            {education.degree} · {education.fieldOfStudy}
                                        </Text>
                                        <Text style={{ marginTop: 2, fontSize: 10 }}>{education.institution}</Text>
                                    </View>
                                    <Text style={{ fontSize: 9, color: 'gray' }}>
                                        {formatDate(education.startDate, 'short')} - {education.isOngoing ? translate(lang, 'present') : formatDate(education.endDate, 'short')}
                                    </Text>
                                </View>
                                {education.description && (
                                    <Text>{education.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {courses.length > 0 && (
                    <View style={classicStyles.section}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'courses_certifications')}
                        </Text>
                        {courses.map((course) => (
                            <View key={course.id} style={classicStyles.sectionItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{course.courseName}</Text>
                                        <Text style={{ marginTop: 2, fontSize: 10 }}>{course.platform}</Text>
                                    </View>
                                    <Text style={{ fontSize: 9, color: 'gray' }}>
                                        {course.isOngoing ? translate(lang, 'in_progress') : `${translate(lang, 'completed')}: ${formatDate(course.completionDate, 'short')}`}
                                    </Text>
                                </View>
                                {course.description && (
                                    <Text>{course.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {skills.skillsText && (
                    <View style={classicStyles.section}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'skills')}
                        </Text>
                        <View style={{ marginTop: 8 }}>
                            {formatRichText(skills.skillsText).map((segment, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        marginBottom: 1,
                                        fontWeight: segment.bold ? 'bold' : 'normal',
                                        fontStyle: segment.italic ? 'italic' : 'normal',
                                    }}
                                >
                                    {segment.text}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {footer.footerText && (
                    <View style={classicStyles.footer}>
                        <Text style={classicStyles.footerText}>{footer.footerText}</Text>
                    </View>
                )}
            </Page>
        </Document>
    )
}

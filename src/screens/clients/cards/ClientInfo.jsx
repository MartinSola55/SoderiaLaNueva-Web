/* eslint-disable no-console */
import { Col, Row } from "react-bootstrap";
import { Button, Card, CheckBox, DealerDropdown, DeliveryDayDropdown, Input, InvoiceTypesDropdown, Label, Loader, Spinner, TaxConditionsDropdown } from "../../../components";
import { useNavigate } from "react-router";
import AddressInput from "../../../components/AddressInput/AddressInput";
import { formatAddress } from './../../../components/AddressInput/addressInput.helper';

export const ClientInfo = ({
    form,
    loading,
    submiting,
    isWatching,
    onSubmit,
    onInputChange
}) => {
    const navigate = useNavigate();

    console.log(form.address);

    return (
        <Card
            title='Cliente'
            body={loading ? <Spinner /> :
                <>
                    <Row className='align-items-center'>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label required={!isWatching}>Nombre del cliente</Label>
                            <Input
                                value={form.name}
                                disabled={isWatching}
                                onChange={(value) => onInputChange(value, 'name')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label required={!isWatching}>Dirección</Label>
                            <AddressInput
                                onAddressSelect={(address) => onInputChange(formatAddress(address), 'address')}
                                disabled={isWatching}
                                value={formatAddress(form.address)}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label required={!isWatching}>Teléfono</Label>
                            <Input
                                value={form.phone}
                                disabled={isWatching}
                                onChange={(value) => onInputChange(value, 'phone')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label>Observaciones</Label>
                            <Input
                                tag='textarea'
                                value={form.observations}
                                disabled={isWatching}
                                onChange={(value) => onInputChange(value, 'observations')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label>Repartidor</Label>
                            <DealerDropdown
                                value={form.dealerId}
                                disabled={isWatching}
                                onChange={(value) => onInputChange(value, 'dealerId')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <Label>Día de reparto</Label>
                            <DeliveryDayDropdown
                                value={form.deliveryDay}
                                disabled={isWatching}
                                onChange={(value) => onInputChange(value, 'deliveryDay')}
                            />
                        </Col>
                        <Col xs={12} className='pe-3 mb-3'>
                            <CheckBox
                                label='¿Quiere factura?'
                                name='hasInvoice'
                                value={form.hasInvoice}
                                checked={form.hasInvoice}
                                disabled={isWatching}
                                onChange={(value) => onInputChange(value, 'hasInvoice')}
                            />
                        </Col>
                        {form.hasInvoice && (
                            <>
                                <Col xs={12} className='pe-3 mb-3'>
                                    <Label required={!isWatching}>Tipo de factura</Label>
                                    <InvoiceTypesDropdown
                                        required={!isWatching}
                                        value={form.invoiceType}
                                        disabled={isWatching}
                                        onChange={(value) => onInputChange(value, 'invoiceType')}
                                    />
                                </Col>
                                <Col xs={12} className='pe-3 mb-3'>
                                    <Label required={!isWatching}>
                                        Condición frente al IVA
                                    </Label>
                                    <TaxConditionsDropdown
                                        required={!isWatching}
                                        value={form.taxCondition}
                                        disabled={isWatching}
                                        onChange={(value) => onInputChange(value, 'taxCondition')}
                                    />
                                </Col>
                                <Col xs={12} className='pe-3 mb-3'>
                                    <Label required={!isWatching}>CUIT</Label>
                                    <Input
                                        value={form.cuit}
                                        disabled={isWatching}
                                        onChange={(value) => onInputChange(value, 'cuit')}
                                    />
                                </Col>
                            </>
                        )}
                    </Row>
                </>
            }
            footer={
                <div className='d-flex justify-content-between'>
                    <Button variant='secondary' className='me-2' onClick={() => navigate('/clientes/list')}>
                        Volver
                    </Button>
                    {!isWatching && (
                        <Button onClick={onSubmit} disabled={submiting}>
                            {submiting ? <Loader /> : 'Guardar'}
                        </Button>
                    )}
                </div>
            }
        />
    );
};